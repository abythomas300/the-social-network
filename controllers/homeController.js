// controller methods definition
function welcomeMessage(req, res){
    
    const flashMessage = req.query.message
    let successMessage = ''
    if(flashMessage == 'loggedout') {
        successMessage = 'You have been logged out successfully'
    }
    res.render('homepage', {message: successMessage})

}

function loginPage(req, res) {

    const successMessage = req.flash('success')
    console.log("Flash Message: ", successMessage)
    res.render('loginPage', {message: successMessage})

}


// exporting methods
module.exports = {
    welcomeMessage,
    loginPage
}