function isLoggedIn(req, res, next){
    if((req.session) && (req.session.user)) {
        return next()
    } else {
        res.send("You are not logged in, please login to continue")
    }
}

// exporting method
module.exports = isLoggedIn