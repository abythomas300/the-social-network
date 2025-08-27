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
    }, 
    likes: [
        // 'likes' field holds array with user id as values
        {
            type: mongoose.Schema.Types.ObjectId,   
            ref: user
        }
    ],
    comments: [
        {
            // comments field is an array, each array document has 3 fields
            commentAuthor: {
                type: mongoose.Schema.Types.ObjectId,
                ref: user
            },
            content: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
},{
    timestamps: true
})

// creating a model object
const Post = mongoose.model('posts', postSchema)

// exporting model object
module.exports = Post