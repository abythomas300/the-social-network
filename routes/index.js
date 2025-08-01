// importing necessary libraries
const express = require('express')
const router = express.Router()

// importing other routes
const postRoutes = require('./postRoutes')
const adminRoutes = require('./adminRoutes')
const authRoutes = require('./authRoutes')

// importing controllers
const homeController = require('../controllers/homeController')

// route handlers
router.get('/', homeController.welcomeMessage)




// exporting router object
module.exports = router