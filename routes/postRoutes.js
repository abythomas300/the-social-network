// importing necessary libraries
const express = require('express')
const router = express.Router()

// importing middlewares
const isLoggedIn = require('../middlewares/isLoggedIn')

// importing contoller
const postController = require('../controllers/postController')


// route handlers
router.get('/', isLoggedIn, postController.getAllPosts)
router.get('/newblog', isLoggedIn, postController.showBlogCreationPage)
router.post('/', isLoggedIn, postController.createNewPost)
router.delete('/:blogId', isLoggedIn, postController.deletePost)
router.get('/editBlog/:blogId', postController.showBlogEditPage )
router.patch('/:blogId', isLoggedIn, postController.updatePost)


// exporting router object
module.exports = router