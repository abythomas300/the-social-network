const mongoose = require('mongoose')
require('dotenv').config({path: '../.env'})

const postModel = require('../models/post')
const User = require('../models/user')

console.log(process.env.MONGO_URI)

mongoose.connect(process.env.MONGO_URI)
    .then(async function(){
        console.log("Database connection successfull")
        const newPost = new postModel({title: 'My Favourite Book', description: 'My favourite book is Many Lives Many Masters by Dr Brian Lewis, it is about a therapy session with ....'})
        newPost.save()
            .then(function(){
                console.log("New post saved successfully")
                mongoose.disconnect()
            })
        
    })
    .catch(function(error){
        console.log("Database connection error, reason: ", error)
    })