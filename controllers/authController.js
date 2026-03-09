const userModel = require('../models/user')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const otplib = require('otplib')
const nodemailer = require('nodemailer')


// nodemailer initialization
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    service: process.env.EMAIL_SERVICE,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURITY_STATUS,
    auth: {
        user: process.env.EMAIL_SENDER_ADDRESS,
        pass: process.env.EMAIL_PASS
    }
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
        
        // sending mail
        const senderName = "The Social Network"
        const start = performance.now()
        const info = await transporter.sendMail({
            from: `"${senderName}" <${process.env.EMAIL_SENDER_ADDRESS}>`,
            to: emailAddress,
            subject: 'OTP for Account Creation',
            text: `Your One Time Password (OTP) for creating an account in The Social Network is ${generatedOTP}. Your code only vaild for 2 minutes and do not share it with anyone else.`,
            html: `Welcome to The Social Network, you are one verification away from creating your account. <br><br> Your One Time Password (<b>OTP</b>) for creating an account in The Social Network is <b> ${generatedOTP} </b>. Your code only <b> vaild for 2 minutes </b> and do not share it with anyone else. <br><br> Best Regards, <br> Admin <br>The Social Network `
        })
        const end = performance.now()
        const timeTaken = (end - start) / 1000

        res.render('otpPage_user', {email: emailAddress})  // redirecting users to login page

    }
    catch(error){

        req.flash('failure', 'Registration Error, try again later')

        res.redirect('/register')

    }

}


async function otpCheck(req, res) {

    try{
        
        const otpEnteredTime = new Date()

        const emailAddress = req.body.email
        const userEnteredOTP = req.body.otp


        const userDetails = await userModel.findOne({email: emailAddress})

        // checking whether otp timer has expired
        // if otp is entered within 2 minutes
        if((otpEnteredTime - userDetails.otpGeneratedAt) <= 120000) {  // OTP expiry set to 2 minutes

            // comparing otps
            const isMatch = await bcrypt.compare(userEnteredOTP, userDetails.otp)

            // If both OTPs are the same
            if(isMatch) {

                // setting the verified field to 'true'
                const modifiedUserDocument = await userModel.findByIdAndUpdate(userDetails._id, {$set: {isVerified: true}}, {new: true})

                // creating flash message
                req.flash('success', 'Registraion Successful.')

                // redirecting user to login page
                res.redirect('/login')

            } else {  // If OTPs are not same


                // deleting saved user details from DB
                await userModel.findByIdAndDelete(userDetails._id)

                req.flash('failure', 'Registration failed, OTP Does not match.')

                res.redirect('/register')

            }

        } else {  // If OTP is not entered within 2 minutes


            const user = await userModel.findById(userDetails._id)

            // deleting saved user details from DB
            await userModel.findByIdAndDelete(userDetails._id)

            req.flash('failure', 'Registration failed, OTP Expired.')

            res.redirect('/register')

        }

    }
    catch(error) {

        res.send("There was an error verifying the OTP, try again later.")

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

            // comparing passwords
            const isMatch = await bcrypt.compare(password, user.password)
            
            if(isMatch) {

                // creating session 
                req.session.user = {
                    userId : user._id,
                    username: user.username,
                    role: user.role,
                    joinedDate: user.createdAt,
                    restrictionStatus: user.isRestricted,
                    useremail: user.email
                }

                req.flash('success', 'Login Successful')  // creating a flash message

                if(user.isRestricted === true) {
                    req.flash('info', 'Your account has been restricted, some features may be inaccessible.')
                }
                
                // redirecting based on role
                const role = req.session.user.role
                role === 'admin'? res.redirect('/admin/blogInfo'): res.redirect('/post') 

            } else {

                req.flash('failure', 'Wrong Password')

                res.redirect('/login')
            }

        } else {

            req.flash('failure', 'User not found')

            res.redirect('/login')
            
        }
    }
    catch(error) {

        req.flash('faliure', 'Cannot Login, Try again later')

        res.redirect('/login')

    }

}


// method to handle user logout
async function logoutUser(req, res){
    try {
        req.session.destroy(function(error){  // req.session.destroy() is a CALLBACK based asynchronous method(not PROMISE based), so we cannot use await on this
            if(error) {
            }else{
                res.redirect('/?message=loggedout' )  // sending logout indicator as a query parameter as req.flash() does not work (req.flash() need session but session is already would get deleted here.)
            }
        })

    }catch(err){
        req.flash('failure', 'Logout failed')

        res.redirect('/post')
    }
}


// exporting methods
module.exports = {
    displayRegistrationPage,
    registerUser,
    loginUser,
    logoutUser,
    otpCheck
}
