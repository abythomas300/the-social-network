// controller methods definition
function welcomeMessage(req, res){
    res.render('homepage')
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