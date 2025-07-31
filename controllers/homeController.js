// controller method definition
function welcomeMessage(req, res){
    res.send('Welcome to Homepage')
}

// exporting method
module.exports = {
    welcomeMessage
}