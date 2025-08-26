function isAdmin(req, res, next) {

    if((req.session.user) && (req.session.user.role === 'admin')) {
        return next()
    } else {
        res.send("Warning: No permission to access this route.")
    }

}

// exporting method
module.exports = isAdmin