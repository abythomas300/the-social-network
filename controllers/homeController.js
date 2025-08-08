// controller methods definition
function welcomeMessage(req, res){
    res.send('<h3 style="text-align:center; font-size: 2.5em"><i>Welcome to <span style="color:blue;">The Social Network</span></i></h3>')
}

function loginPage(req, res) {
    res.send('<h3 style="text-align:center; font-size: 2.5em; color:blue"><i>The Social Network</i></h3> <h2><u>Login Page</u></h2>')
}


// exporting methods
module.exports = {
    welcomeMessage,
    loginPage
}