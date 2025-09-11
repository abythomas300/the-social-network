const userModel = require('../models/user')

async function isRestricted(req, res, next) {

    const userDetails = await userModel.findOne({username: req.session.user.username})
    
    if(userDetails.isRestricted === false) {
        console.log(`Action request from user ${userDetails.username} allowed`)
        next()
    } else {
        console.log(`Action request from user ${userDetails.username} blocked. Reason: Restricted User`)
        req.flash('failure', 'Access Denied since your account is restricted.')
        
        res.redirect('/post')
    }

}



module.exports = isRestricted