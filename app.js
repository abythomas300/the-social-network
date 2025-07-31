// importing necessary libraries
const express = require('express')
const app = express()
require('dotenv').config

// importing router
const indexRouter = require('./routes/index')

const port = 3000

// middleware definition
app.use('/', indexRouter)


// starting server
app.listen(port,function(){
    console.log(`Server is running at http://localhost:${port}/`)
})