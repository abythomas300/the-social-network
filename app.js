// importing necessary libraries
const express = require('express')
const app = express()
require('dotenv').config

const port = 3000

// starting server
app.listen(port,function(){
    console.log(`Server is running at http://localhost:${port}/`)
})