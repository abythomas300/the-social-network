// importing necessary modules
const postModel = require('../models/post')
const mongoose = require('mongoose')


async function getAllPosts(req, res){

    const allPosts = await postModel.find({}).populate('author')
    console.log("Fetched Data -->", allPosts)
    if(allPosts.length === 0){  // if there is no data in DB (ie. 'allPosts' is empty)
        res.send('<h3 style="text-align:center; font-size: 2.5em; color:blue"><i>The Social Network</i></h3> <p>All posts will appear here, no new posts for now. </p>')
    } else {
        const successMessage = req.flash('success')  
        console.log("Flash message (success) in postController: ", successMessage)
        const data = {    // combining data fetched from DB and flash message into one single object so that it can be passed to view
            message: successMessage,
            blogs: allPosts
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
        const newPost = new postModel({title: req.body.title, content: req.body.content, author: req.session.user.userId})
        console.log("Saving post to DB ...")
        await newPost.save() // saving the post to 'posts' collection in DB
        console.log("Post created Successfully")
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
        const postIdToRemove = req.body.postId;
        console.log("Post delete request detected, Post id to delete: ", postIdToRemove)
        const deletedPost = await postModel.findByIdAndDelete(postIdToRemove)
        console.log("Post Deleted Successfully")
        console.log("Post Details: ", deletedPost)
        res.send("Post Deleted Successfully")
    }
    catch(error){
        console.log("Post Deletion Failed, reason: ", error)
        res.send("Post Deletion Failed.")
    }

}


async function updatePost(req, res) {

    try{
        const updateData = req.body
        console.log("Post to be updated(id): ", req.params.id)
        const updatedData = await postModel.findByIdAndUpdate(req.params.id, updateData, {new: true})
        console.log("Post updated successfully, details: ", updateData)
        res.send("Post Updated Successfully")
    }
    catch(error){
        console.log("Post Updation Failed, reason: ", error)
        res.send("Post Updation Failed")
    }

}



// exporting all methods
module.exports = {
    getAllPosts,
    createNewPost,
    deletePost,
    updatePost,
    showBlogCreationPage
}
