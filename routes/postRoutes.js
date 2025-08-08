// importing necessary libraries
const express = require('express')
const router = express.Router()

// importing middlewares
const mid = require('../middlewares/isLoggedIn')

// importing contoller
const postController = require('../controllers/postController')
const isLoggedIn = require('../middlewares/isLoggedIn')

// route handlers
router.get('/', isLoggedIn, postController.getAllPosts)


// exporting router object
module.exports = router