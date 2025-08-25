const postModel = require('../models/post')
const userModel = require('../models/user')



function displayAdminHomepage(req, res) {
    res.render('homepage_admin')
}

async function displayAllBlogs(req, res) {

    try{
        const allBlogs = await postModel.find({}).populate('author')
        const blogCount = await postModel.countDocuments({}) // taking count of all available blogs in DB
        const allUsers = await userModel.find({})
        const usersCount = await userModel.countDocuments({})
        console.log("Total Users:", usersCount)
        console.log("Total Blogs fetched from DB: ", blogCount)
        allBlogs.blogCount = blogCount // adding blogs count to the object that is passed to view
        allBlogs.userCount = usersCount // adding users count to object that is passed to view
        console.log("ALL FETCHED BLOGS:")
        console.log(allBlogs)
        if(allBlogs.length === 0){
            res.send("No posts available for this moment")
        }else{
            res.render('blogsListPage_admin', {blogs: allBlogs})
        }
    }catch(error){
        console.log("Failed to fetch blogs from DB, reason: ", error)
        res.render("Error displaying blogs, try again.")
    }
}

function displayUsersList(req, res) {

    res.render('usersListPage_admin')

}

async function showBlogEditPage(req, res) {
    try{
        const blogIdToDelete = req.params.blogId
        console.log("Blog Id: ", blogIdToDelete)
        const entireBlog = await postModel.findById(blogIdToDelete)
        console.log("The Entire Blog to be updated--> ", entireBlog)
        res.render('editBlogPage', {previousBlog: entireBlog})

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