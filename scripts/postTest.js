const mongoose = require('mongoose')
require('dotenv').config({path: '../.env'})

const postModel = require('../models/post')
const User = require('../models/user')

mongoose.connect(process.env.MONGO_URI)
    .then(async function(){
        const newPost = new postModel({title: 'My Favourite Book', description: 'My favourite book is Many Lives Many Masters by Dr Brian Lewis, it is about a therapy session with ....'})
        newPost.save()
            .then(function(){
                mongoose.disconnect()
            })
        
    })
    .catch(function(error){
    })