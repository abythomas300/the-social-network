// importing necessary libraries
const express = require('express')
const router = express.Router()

// importing middlewares
const isLoggedIn = require('../middlewares/isLoggedIn')
const upload = require('../middlewares/multer-config')

// importing contoller
const postController = require('../controllers/postController')


// route handlers
router.get('/', isLoggedIn, postController.getAllPosts)
router.get('/newblog', isLoggedIn, postController.showBlogCreationPage)
router.post('/', isLoggedIn, upload.single('blogThumbail'), postController.createNewPost)
router.delete('/:blogId', isLoggedIn, postController.deletePost)
router.get('/editBlog/:blogId', isLoggedIn, postController.showBlogEditPage )
router.patch('/:blogId', isLoggedIn, postController.updatePost)


// exporting router object
module.exports = router