const userModel = require('../models/user')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

// method to show registration page to user
function displayRegistrationPage(req, res) {
    res.send('<h3 style="text-align:center; font-size: 2.5em; color:blue"><i>The Social Network</i></h3> <h2><u>Registration Page</u></h2>')
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

// method to handle login user
async function loginUser(req, res) {

    try {
        // getting user inserted credentials
        const username = req.body.username
        const password = req.body.password

        // checking if a user with that 'username' exists
        const user = await userModel.findOne({username: username}) // getting the first document with that username

        if(user) {  // if such user exists

            console.log("User found")
            // comparing passwords
            const isMatch = await bcrypt.compare(password, user.password)
            
            if(isMatch) {
                console.log("Passwords Match.")

                // creating session 
                req.session.user = {
                    userId : user._id,
                    username: user.username,
                    role: user.role
                }
                console.log("- - - Session Created - - - ")
                console.log("Session Details :-")
                console.log(`User ID: ${req.session.user.userId}`)
                console.log(`UserName: ${req.session.user.username}`)
                console.log(`User's Role: ${req.session.user.role}`)

                res.send(`Welcome ${user.username} !`)
            } else {
                console.log("Passwords Does Not Match")
                res.send("Wrong Password")
            }

        } else {
            console.log("Cannot find user with that username")
            res.send("Cannot find an account. Sign Up to create an account.")
        }


    }
    catch(error) {
        console.log("Login process failed, reason:", error)
        res.send("Login Failed")
    }

}

// method to handle user logout
async function logoutUser(req, res){
    try {
        console.log("Session data about to be cleared")
        console.log("Details :-")
        console.log(`User ID: ${req.session.user.userId}`)
        console.log(`UserName: ${req.session.user.username}`)
        console.log(`User's Role: ${req.session.user.role}`)

        req.session.destroy(function(error){  // req.session.destroy() is a CALLBACK based asynchronous method(not PROMISE based), so we cannot use await on this
            if(error) {
                console.log("Logout Failed, reason: ", error)
            }else{
                console.log("Logout Successful")
                return res.send(`Logout successful`)
            }
        })

    }catch(err){
        console.log("Logout Error, reason: ", err)
    }
}


// exporting methods
module.exports = {
    displayRegistrationPage,
    registerUser,
    loginUser,
    logoutUser
}
