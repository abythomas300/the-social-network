const userModel = require('../models/user')

async function isRestricted(req, res) {

    const userDetails = await userModel.findOne({username: req.session.user.username})
    
    if(userDetails.isRestricted === false) {
        console.log(`Action request from user ${userDetails.username} blocked`)
        next()
    } else {
        req.flash('faluire', 'Access Denied')
        
        res.send("Access Denied. \n You cannot perform this action since your account is restricted.")
    }

}



module.exports = isRestricted