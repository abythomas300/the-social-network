const mongoose = require('mongoose')
require('dotenv').config({path: '../.env'})  // path needs to be specified explicity because this file is not in root

const userModel = require('../models/user')

const db_URI = process.env.MONGO_URI
console.log("Connection String: ", db_URI)

mongoose.connect(db_URI)
    .then(async function(){
        console.log("Database connection successfull")
        const newUser = new userModel({username: 'abythomas300', password: 'supersecretpassword'})  // creating a new object from userModel model
        newUser.save()
            .then(function(){
                console.log("User details has been saved to database")
                mongoose.disconnect()
            })
    })
.catch(function(error){
    console.log("Database error, reason: ", error)
})