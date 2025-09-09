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
    res.render('loginPage')
}


// exporting methods
module.exports = {
    welcomeMessage,
    loginPage
}