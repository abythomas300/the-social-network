// importing necessary libraries
const express = require('express')
const router = express.Router()

// importing controller
const adminController = require('../controllers/adminController')

// route handlers
router.get('/', adminController.displayAdminHomepage)
router.get('/blogInfo', adminController.displayAllBlogs)
router.get('/userInfo', adminController.displayUsersList)
router.get('/editBlog/:blogId', adminController.showBlogEditPage)




// exporting router object
module.exports = router