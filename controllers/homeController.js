// controller methods definition
function welcomeMessage(req, res){
    res.render('homepage')
}

function loginPage(req, res) {
    res.render('loginPage')
}


// exporting methods
module.exports = {
    welcomeMessage,
    loginPage
}