const userModel = require('../models/user')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

// method to show registration page to user
function displayRegistrationPage(req, res) {
    res.send('<h3 style="text-align:center; font-size: 2.5em; style=color:blue"><i>The Social Network</i></h3> <h5><u>Registration Page</u></h5>')
}

// method to handle user registration 
async function registerUser(req, res) {

    try {
        // getting credentials from user's request
        const username = req.body.username
        const password = req.body.password

        // encrypting password
        const hashString = await bcrypt.hash(password, 10)   
        const newUser = new userModel({username: username, password: hashString}) // creating user model object
        await newUser.save()  // passing user model object to mongoose to create new document in DB
        res.send("Registration Successful")
    }
    catch(error){
        console.log("Registration Failed, reason: ", error)
        res.send("Registration Failed")
    }

}

