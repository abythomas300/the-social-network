const userModel = require('../models/user')

async function isRestricted(req, res, next) {

    const userDetails = await userModel.findOne({username: req.session.user.username})
    
    if(userDetails.isRestricted === false) {
        next()
    } else {
        req.flash('failure', 'Access Denied : Your account is restricted.')
        
        res.redirect('/post')
    }

}



module.exports = isRestricted