const mongoose = require('mongoose')
require('dotenv').config({path: '../.env'})  // path needs to be specified explicity because this file is not in root

const userModel = require('../models/user')

const db_URI = process.env.MONGO_URI

mongoose.connect(db_URI)
    .then(async function(){
        const newUser = new userModel({username: 'abythomas300', password: 'supersecretpassword'})  // creating a new object from userModel model
        newUser.save()
            .then(function(){
                mongoose.disconnect()
            })
    })
.catch(function(error){
})