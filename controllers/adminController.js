const postModel = require('../models/post')
const userModel = require('../models/user')



function displayAdminHomepage(req, res) {
    res.render('homepage_admin')
}


async function displayAllBlogs(req, res) {

    try{

        const allBlogs = await postModel.find({}).populate([{path: 'author'}, {path: 'comments.commentAuthor'}])
        const blogsCount = await postModel.countDocuments({}) // taking count of all available blogs in DB
        const usersCount = await userModel.countDocuments({})
        
        // adding all blogs, flash message, user count and blogs count to a saperate object for passing to view
        const data = {
            blogs: allBlogs,
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

        const data = {
            users: allUsers
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
            req.flash('success', 'Comment deleted')
            res.redirect('/admin/blogInfo')
        }
        catch(error) {
            console.log("Comment Deletion Failed, reason: ", error)
        }

    } else {
        req.flash('info', 'You have no permission to do this action.')
        res.redirect('/admin/blogInfo')
    }

}


async function deleteUser(req, res) {

    try{

        console.log("REQUEST BODY*************", req.body)
        const deletedUser = await userModel.findOneAndDelete({username: req.body.username})
        console.log("User Deleted: ", deletedUser)

        // creating a flash message
        req.flash('success', 'User deleted successfully')

        res.redirect('/admin/userInfo')
    }
    catch(error) {

        console.log("Error in deleting user, reason: ", error)
        res.send("Cannot delete user, try again later.")

    }
}


async function restrictUser(req, res) {  

    const userDetails = await userModel.findOne({username: req.body.username})

    if(userDetails.isRestricted === false) {

        const updatedDocument = await userModel.findOneAndUpdate({username: req.body.username}, {$set: {isRestricted: true} }, {new: true})
        console.log(`Restriction for user ${req.body.username} applied successfully`)
        console.log("Updated user document: ", updatedDocument)

        req.flash('success', 'User has been restricted')

        res.redirect('/admin/userInfo')

    } else {

        const updatedDocument = await userModel.findOneAndUpdate({username: req.body.username}, {$set: {isRestricted: false} }, {new: true})
        console.log(`Restriction for user ${req.body.username} removed successfully`)

        req.flash('success', 'User restriction removed has been removed')

        res.redirect('/admin/userInfo')
    }

}


// exporting methods
module.exports = {
    displayAdminHomepage, 
    displayUsersList,
    displayAllBlogs,
    showBlogEditPage,
    deleteComment,
    deleteUser,
    restrictUser
}