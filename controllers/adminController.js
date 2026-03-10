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
        const entireBlog = await postModel.findById(blogIdToDelete)
        res.render('editBlogPage_admin', {previousBlog: entireBlog})

    }catch(error){

        res.send("Error displaying blog edit page")
    }
}


async function deleteComment(req, res) {

    // checking whether the request is from admin itself
    if(req.session.user.role === 'admin') {

        try{
            const blogId = req.params.blogId
            const commentIdToDelete = req.body.commentId
            await postModel.findOneAndUpdate({_id: blogId}, {$pull: {comments: {_id: commentIdToDelete}}})
            req.flash('success', 'Comment deleted')
            res.redirect('/admin/blogInfo')
        }
        catch(error) {

        }

    } else {
        req.flash('info', 'You have no permission to do this action.')
        res.redirect('/admin/blogInfo')
    }

}


async function deleteUser(req, res) {

    try{

        await userModel.findOneAndDelete({username: req.body.username})

        // creating a flash message
        req.flash('success', 'User deleted successfully')

        res.redirect('/admin/userInfo')
    }
    catch(error) {


        res.send("Cannot delete user, try again later.")

    }
}


async function restrictUser(req, res) {  

    const userDetails = await userModel.findOne({username: req.body.username})

    if(userDetails.isRestricted === false) {

        await userModel.findOneAndUpdate({username: req.body.username}, {$set: {isRestricted: true} })

        req.flash('success', 'User has been restricted')

        res.redirect('/admin/userInfo')

    } else {

        await userModel.findOneAndUpdate({username: req.body.username}, {$set: {isRestricted: false} })


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