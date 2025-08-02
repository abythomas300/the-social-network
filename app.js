// importing necessary libraries
const express = require('express')
const app = express()
require('dotenv').config

// importing routes
const postRouter = require('./routes/postRoutes')
const adminRoutes = require('./routes/adminRoutes')
const authRoutes = require('./routes/authRoutes')

// importing homeController
const homeController = require('./controllers/homeController')

const port = 3000

// middleware definition
app.use('/post', postRouter)
app.use('/admin', adminRoutes)
app.use('/auth', authRoutes)

// route handlers
app.get('/', homeController.welcomeMessage)  // handling '/localhost:<port>/' GET request


// starting server
app.listen(port,function(){
    console.log(`Server is running at http://localhost:${port}/`)
})