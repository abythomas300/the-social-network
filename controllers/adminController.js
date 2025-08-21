const postModel = require('../models/post')



function displayAdminHomepage(req, res) {
    res.render('homepage_admin')
}

async function displayAllBlogs(req, res) {

    try{
        const allBlogs = await postModel.find({}).populate('author')
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





// exporting methods
module.exports = {
    displayAdminHomepage, 
    displayUsersList,
    displayAllBlogs
}