const userModel = require('../models/user')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

// method to show registration page to user
function displayRegistrationPage(req, res) {
    res.send('<h3 style="text-align:center; font-size: 2.5em; style=color:blue"><i>The Social Network</i></h3> <h5><u>Registration Page</u></h5>')
}



