// importing necessary modules
const postModel = require('../models/post')
const mongoose = require('mongoose')


async function getAllPosts(req, res){

    const allPosts = await postModel.find({})
    console.log("Fetched Data -->", allPosts)
    if(allPosts.length === 0){  // if there is no data in DB (ie. 'allPosts' is empty)
        res.send('<h3 style="text-align:center; font-size: 2.5em; color:blue"><i>The Social Network</i></h3> <p>All posts will appear here, no new posts for now. </p>')
    } else {
        res.send(allPosts)
    }

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
        res.send("Post created Successfully")
    }
    catch(error){
        console.log("Post Creation Failed, reason: ", error)
        res.send("Post Creation Failed")
    }
}



// exporting all methods
module.exports = {
    getAllPosts,
    createNewPost
}
