const mongoose = require('mongoose')
const user = require('./user')

// defining schema for 'posts' collection in DB
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: user  // refering to the user model
    },
    thumbnail: {
        type: String,
        required: true
    }
},{
    timestamps: true
})

// creating a model object
const Post = mongoose.model('posts', postSchema)

// exporting model object
module.exports = Post