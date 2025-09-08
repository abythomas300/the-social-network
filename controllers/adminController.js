const postModel = require('../models/post')
const userModel = require('../models/user')



function displayAdminHomepage(req, res) {
    res.render('homepage_admin')
}


async function displayAllBlogs(req, res) {

    try{

        const allBlogs = await postModel.find({}).populate([{path: 'author'}, {path: 'comments.commentAuthor'}])
        const blogsCount = await postModel.countDocuments({}) // taking count of all available blogs in DB
        const allUsers = await userModel.find({})
        const usersCount = await userModel.countDocuments({})

        // fetching flash messages passed to this route
        const successMessage = req.flash('success')
        
        // adding all blogs, flash message, user count and blogs count to a saperate object for passing to view
        const data = {
            blogs: allBlogs,
            message: successMessage,
            blogsCount: blogsCount,
            usersCount: usersCount
        }

        if(allBlogs.length === 0){
            res.send("No posts available for this moment")
        }else{
            res.render('blogsListPage_admin', {data: data})
        }

    }catch(error){

        console.log("Failed to fetch blogs from DB, reason: ", error)
        res.render("Error displaying blogs, try again.")

    }
}

async function displayUsersList(req, res) {

    try{

        const allUsers = await userModel.find({})

        const successMessage = req.flash('success')

        const data = {
            users: allUsers,
            message: successMessage
        }

        res.render('usersListPage_admin', {data: data})

    }catch(error){

    }
}

async function showBlogEditPage(req, res) {
    try{
        const blogIdToDelete = req.params.blogId
        console.log("Blog Id: ", blogIdToDelete)
        const entireBlog = await postModel.findById(blogIdToDelete)
        console.log("The Entire Blog to be updated--> ", entireBlog)
        res.render('editBlogPage_admin', {previousBlog: entireBlog})

    }catch(error){
        console.log("Error showing blog edit page, reason: ", error)
        res.send("Error displaying blog edit page")
    }
}


async function deleteComment(req, res) {

    // checking whether the request is from admin itself
    if(req.session.user.role === 'admin') {

        try{
            const blogId = req.params.blogId
            const commentIdToDelete = req.body.commentId
            const deletedComment = await postModel.findOneAndUpdate({_id: blogId}, {$pull: {comments: {_id: commentIdToDelete}}}, {new: true})
            console.log("👍Comment Deleted")
            console.log("Deleted Comment Details: ", deletedComment)
            req.flash('success', 'Comment Deletion Success')
            res.redirect('/admin/blogInfo')
        }
        catch(error) {
            console.log("Comment Deletion Failed, reason: ", error)
        }

    } else {
        res.send("Warning: You have no permission to do this action.")
    }

}


async function deleteUser(req, res) {

    try{

        console.log("REQUEST BODY*************", req.body)
        const deletedUser = await userModel.findOneAndDelete({username: req.body.username})
        console.log("User Deleted: ", deletedUser)

        // creating a flash message
        req.flash('success', 'User Deletion Success')

        res.redirect('/admin/userInfo')
    }
    catch(error) {

        console.log("Error in deleting user, reason: ", error)
        res.send("Cannot delete user, try again later.")

    }
}



// exporting methods
module.exports = {
    displayAdminHomepage, 
    displayUsersList,
    displayAllBlogs,
    showBlogEditPage,
    deleteComment,
    deleteUser
}