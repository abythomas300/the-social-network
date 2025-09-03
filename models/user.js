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
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid Email Format']
    }   
},
{
    timestamps: true  // to automatically add created and updated time to db
})

// creating model object for 'user' related requests
const User = mongoose.model('user', userSchema)

// exporting 'user' model object
module.exports = User