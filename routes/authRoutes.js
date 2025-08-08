// importing necessary libraries
const express = require('express')
const router = express.Router()

// importing contoller
const authController = require('../controllers/authController')

// route handlers
router.get('/', authController.displayRegistrationPage)
router.post('/', authController.registerUser)


// exporting router object
module.exports = router