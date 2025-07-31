// importing necessary libraries
const express = require('express')
const router = express.Router()

// importing controllers
const homeController = require('../controllers/homeController')

// route handlers
router.get('/', homeController.welcomeMessage)

module.exports = router