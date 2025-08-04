// importing necessary libraries
const express = require('express')
const app = express()
require('dotenv').config()
const mongoose = require('mongoose')

// importing routes
const postRouter = require('./routes/postRoutes')
const adminRoutes = require('./routes/adminRoutes')
const authRoutes = require('./routes/authRoutes')

// importing homeController
const homeController = require('./controllers/homeController')

const port = process.env.PORT
const db_URI = process.env.MONGO_URI

// middleware definition
app.use('/post', postRouter)
app.use('/admin', adminRoutes)
app.use('/register', authRoutes)

// route handlers
app.get('/', homeController.welcomeMessage)  // handling '/localhost:<port>/' GET request



// connecting to database
mongoose.connect(db_URI)
.then(function(){
    console.log("Connected to Database Successfully")
})
.catch(function(error){
    console.log("Database Connection Failed, reason: ", error)
})


// starting server
app.listen(port,function(){
    console.log(`Server is running at http://localhost:${port}/`)
})