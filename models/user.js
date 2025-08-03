// importing mongoose ODM library
const mongoose = require('mongoose')

// defining schema for data passing to 'user' document
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'], default: 'user'
    }
})

// creating model object for 'user' related requests
const User = mongoose.model('user', userSchema)

// exporting 'user' model object
module.exports = User