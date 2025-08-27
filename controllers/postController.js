// importing necessary modules
const postModel = require('../models/post')
const mongoose = require('mongoose')


async function getAllPosts(req, res){

    const allPosts = await postModel.find({}).populate('author')
    const documentCount = await postModel.countDocuments({})
    console.log("Total number of blogs fetched from DB: ", documentCount)
    if(allPosts.length === 0){  // if there is no data in DB (ie. 'allPosts' is empty)
        res.send('<h3 style="text-align:center; font-size: 2.5em; color:blue"><i>The Social Network</i></h3> <p>All posts will appear here, no new posts for now. </p>')
    } else {
        const successMessage = req.flash('success')  
        console.log("Flash message (success) in postController: ", successMessage)

        const data = {    // combining data fetched from DB and flash message into one single object so that it can be passed to view
            message: successMessage,
            blogs: allPosts,
            currentUser: req.session.user
        }
        res.render('postsTemplate', {data: data})
    }

}


function showBlogCreationPage(req, res) {

    res.render('createBlogPage')

}


async function createNewPost(req, res) {

    try {
        console.log("Create new post request detected")
        console.log("Requested User Id", req.session.user.userId)
        console.log("Requested User name", req.session.user.username)
        console.log("Requested User role", req.session.user.userId)
        const newPost = new postModel({title: req.body.title, content: req.body.content, author: req.session.user.userId, thumbnail: req.file.filename})
        console.log("Saving post to DB ...")
        await newPost.save() // saving the post to 'posts' collection in DB
        console.log("Post created Successfully")
        console.log("Uploaded File Details: ", req.file)
        req.flash('success', 'Blog post created successfully')
        res.redirect('/post')  // redirecting user to blogs page after creating a post
    }
    catch(error){
        console.log("Post Creation Failed, reason: ", error)
        res.send("Post Creation Failed")
    }
}


async function deletePost(req, res) {
    
    try{
        const postIdToRemove = req.params.blogId;
        console.log("Post delete request detected, Post id to delete: ", postIdToRemove)
        const originalBlog = await postModel.findById(req.params.blogId)

        // checking whether current user is the author of the blog or whether the request is made by an admin
        if((originalBlog.author._id.toString() === req.session.user.userId) || (req.session.user.role === 'admin')) {

            console.log("Blog deletion request from: ", req.session.user)
            const deletedPost = await postModel.findByIdAndDelete(postIdToRemove)
            console.log("Deleted Blog Details:", deletedPost)
            req.flash('success', 'Blog post deleted successfully')
            
            // redirecting based on role
            const role = req.session.user.role
            role === 'admin'? res.redirect('/admin/blogInfo'): res.redirect('/post')

        }else{
            console.log("Current user id and Blog author id does not match")
            res.send("You cannot delete someone else's post")
        }
        
    }
    catch(error){
        console.log("Post Deletion Failed, reason: ", error)
        res.send("Post Deletion Failed.")
    }

}


async function showBlogEditPage(req, res) {

    try{
        console.log("Request flow reached controller, view on standby")
        const blogIdToDelete = req.params.blogId
        console.log("Blog Id: ", blogIdToDelete)
        const entireBlog = await postModel.findById(blogIdToDelete)
        console.log("The Entire Blog to be updated--> ", entireBlog)
        res.render('editBlogPage', {previousBlog: entireBlog})

    }catch(error){
        console.log("Error showing blog edit page, reason: ", error)
        res.send("Error displaying blog edit page")
    }

}



async function updatePost(req, res) {

    try{
        
        const newData = req.body
        const updatedBlogThumbnail = req.file.filename  // fetching thumbnail name from the file object added to the request object by multer
        newData.thumbnail = updatedBlogThumbnail // adding thumbnail field to the new data
        console.log("Data to be updated: ", newData)
        const previousData = await postModel.findById(req.params.blogId)
        console.log("Previous Data...", previousData)

        // checking whether current user is the author of the blog or whether the request is made by an admin
        if((previousData.author._id.toString() === req.session.user.userId) || (req.session.user.role === 'admin')) {

            const updatedData = await postModel.findByIdAndUpdate(req.params.blogId, newData, {new: true})
            console.log("Data Updated")
            console.log("Printing Updated Data ", updatedData)
            req.flash('success', 'Blog post updated successfully')
            
            //redirecting based on role
            const role = req.session.user.role
            role === 'admin'? res.redirect('/admin/blogInfo'): res.redirect('/post')

        } else {

            console.log("Current user id and Blog author id does not match")
            res.send("Cannot edit someone else's blog post")

        }

    }
    catch(error){
        console.log("Post Updation Failed, reason: ", error)
        res.send("Post Updation Failed")
    }

}



async function likeBlog(req, res) {

    try{

        const blogId = req.params.blogId
        const currentUserId  = req.session.user.userId

        const blogDetails = await postModel.findById(blogId)

        const hasLiked = blogDetails.likes.includes(currentUserId)

        if(hasLiked) {

            console.log("This user has already liked this post once.")
            console.log("Removing user id from likes array")
            const updatedLikeArray = await postModel.findByIdAndUpdate(blogId, {$pull: {like: currentUserId}}, {new:true} )
            console.log("User id removed from like array, result: ", updatedLikeArray)

        } else {

            console.log("This user is liking this post for the first time.")
            console.log("Adding user id to likes array.")
            const updatedLikeArray = await postModel.findByIdAndUpdate(blogId, {$addToSet: {likes: currentUserId}}, {new: true})
            console.log("User id added to like array, result: ", updatedLikeArray)

        }
        
        res.redirect('/post')


    }catch(error) {

        console.log("Like functionality failed, reason: ", error)

    }

}



// exporting all methods
module.exports = {
    getAllPosts,
    createNewPost,
    deletePost,
    showBlogEditPage,
    updatePost,
    showBlogCreationPage,
    likeBlog
}
