// importing necessary libraries
const express = require('express')
const router = express.Router()

// importing contoller
const postController = require('../controllers/postController')

// route handlers
router.get('/', postController.getAllPosts)


// exporting router object
module.exports = router