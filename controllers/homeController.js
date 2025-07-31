// controller method definition
function homepage(req, res){
    req.send('Welcome to Homepage')
}

// exporting method
module.exports = {
    homepage
}