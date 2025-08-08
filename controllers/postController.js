function getAllPosts(req, res) {
    res.send('<h3 style="text-align:center; font-size: 2.5em; color:blue"><i>The Social Network</i></h3> <p>All new posts will appear here, no new posts for now. </p>')
}



// exporting all methods
module.exports = {
    getAllPosts
}