const userModel = require('../models/user')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const otplib = require('otplib')
const nodemailer = require('nodemailer')


// nodemailer initialization
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,  
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
})


// method to show registration page to user
function displayRegistrationPage(req, res) {
    res.render('registrationPage')
}


// method to handle user registration 
async function registerUser(req, res) {

    try {

        // getting credentials from user's request
        const username = req.body.username
        const password = req.body.password
        const emailAddress = req.body.email

        const authenticator = otplib.authenticator
        const secretKey = process.env.OTPLIB_SECRET_KEY
        
        // generating OTP
        const generatedOTP = authenticator.generate(secretKey)
        
        // encrypting password and OTP
        const passwordHash = await bcrypt.hash(password, 10)
        const OTPHash = await bcrypt.hash(generatedOTP, 10)
        
        // saving email, username, password and generated OTP to DB
        const newUser = new userModel({username: username, password: passwordHash, email: emailAddress, otp: OTPHash}) // creating user model object
        await newUser.save()  // passing user model object to mongoose to create new document in DB
        console.log('Email, Username, Password(hash), Generated OTP(hash) saved to DB successfully')

        // sending mail
        const senderName = "The Social Network"
        console.log("Sending mail to SMTP server ......")
        const start = performance.now()
        const info = await transporter.sendMail({
            from: `"${senderName}" <${process.env.EMAIL_SENDER}>`,
            to: emailAddress,
            subject: 'OTP for Account Creation for The Social Network',
            text: `Your One Time Password (OTP) for creating an account in The Social Network is ${generatedOTP}. Your code only vaild for 2 minutes and do not share it with anyone else.`,
            html: `Your One Time Password (<b>OTP</b>) for creating an account in The Social Network is <b> ${generatedOTP} </b>. Your code only <b> vaild for 2 minutes </b> and do not share it with anyone else.`
        })
        const end = performance.now()
        const timeTaken = (end - start) / 1000
        console.log("OTP Mail sent to SMTP server 📧")
        console.log(`Time taken to send mail:  ${Math.round(timeTaken)}s`)
        console.log("Message ID: ", info.messageId)

        res.render('otpPage_user', {email: emailAddress})  // redirecting users to login page

    }
    catch(error){

        console.log("Error in registration, reason: ", error)
        res.send("Error in Registration. Try again later.")

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

                req.flash('success', 'You have successfuly logged in.')  // creating a flash message
                
                // redirecting based on role
                const role = req.session.user.role
                role === 'admin'? res.redirect('/admin/blogInfo'): res.redirect('/post') 

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
                res.redirect('/?message=loggedout' )  // sending logout indicator as a query parameter as req.flash() does not work (req.flash() need session but session is already would get deleted here.)
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
