const mongoose = require('mongoose')

// defining schema for 'posts' collection in DB
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

// creating a model object
const Post = mongoose.model('posts', postSchema)

// exporting model object
module.exports = Post