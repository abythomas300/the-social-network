function displayAdminHomepage(req, res) {

    res.render('homepage_admin')

}

function displayAllBlogs(req, res) {
    
    res.render('blogsListPage_admin')

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