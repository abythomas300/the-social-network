// importing necessary libraries
const express = require('express')
const router = express.Router()

// importing middlewares
const isLoggedIn = require('../middlewares/isLoggedIn')

// importing contoller
const postController = require('../controllers/postController')


// route handlers
router.get('/', isLoggedIn, postController.getAllPosts)
router.post('/', isLoggedIn, postController.createNewPost)
router.delete('/', isLoggedIn, postController.deletePost)
router.patch('/:id', isLoggedIn, postController.updatePost)


// exporting router object
module.exports = router