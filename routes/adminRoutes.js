// importing necessary libraries
const express = require('express')
const router = express.Router()

// importing controller
const adminController = require('../controllers/adminController')
const isAdmin = require('../middlewares/isAdmin')

// route handlers
router.get('/', isAdmin, adminController.displayAdminHomepage)
router.get('/blogInfo', isAdmin, adminController.displayAllBlogs)
router.get('/userInfo', isAdmin, adminController.displayUsersList)
router.get('/editBlog/:blogId', isAdmin, adminController.showBlogEditPage)




// exporting router object
module.exports = router