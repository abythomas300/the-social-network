const postModel = require('../models/post')
const userModel = require('../models/user')



function displayAdminHomepage(req, res) {
    res.render('homepage_admin')
}


async function displayAllBlogs(req, res) {

    try{

        const allBlogs = await postModel.find({}).populate('author')
        const blogsCount = await postModel.countDocuments({}) // taking count of all available blogs in DB
        const allUsers = await userModel.find({})
        const usersCount = await userModel.countDocuments({})

        // fetching flash messages passed to this route
        const successMessage = req.flash('success')
        
        // adding all blogs, flash message, user count and blogs count to a saperate object for passing to view
        const data = {
            blogs: allBlogs,
            message: successMessage,
            blogsCount: blogsCount,
            usersCount: usersCount
        }

        if(allBlogs.length === 0){
            res.send("No posts available for this moment")
        }else{
            res.render('blogsListPage_admin', {data: data})
        }

    }catch(error){

        console.log("Failed to fetch blogs from DB, reason: ", error)
        res.render("Error displaying blogs, try again.")

    }
}

async function displayUsersList(req, res) {

    try{

        const allUsers = await userModel.find({})
        console.log(allUsers)
        res.render('usersListPage_admin', {userInfo: allUsers})

    }catch(error){

    }
}

async function showBlogEditPage(req, res) {
    try{
        const blogIdToDelete = req.params.blogId
        console.log("Blog Id: ", blogIdToDelete)
        const entireBlog = await postModel.findById(blogIdToDelete)
        console.log("The Entire Blog to be updated--> ", entireBlog)
        res.render('editBlogPage_admin', {previousBlog: entireBlog})

    }catch(error){
        console.log("Error showing blog edit page, reason: ", error)
        res.send("Error displaying blog edit page")
    }
}





// exporting methods
module.exports = {
    displayAdminHomepage, 
    displayUsersList,
    displayAllBlogs,
    showBlogEditPage
}