// importing necessary libraries
const express = require('express')
const router = express.Router()

// importing contoller
const authController = require('../controllers/authController')

// route handlers
router.get('/', authController.displayRegistrationPage)
router.post('/', authController.registerUser)
router.post('/login', authController.loginUser)
router.post('/logout', authController.logoutUser)

// exporting router object
module.exports = router