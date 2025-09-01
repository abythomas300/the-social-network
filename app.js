// importing necessary libraries
const express = require('express')
const app = express()
require('dotenv').config()
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const path = require('path')
const helmet = require('helmet')


// importing routes
const postRouter = require('./routes/postRoutes')
const adminRoutes = require('./routes/adminRoutes')
const authRoutes = require('./routes/authRoutes')

// importing necessary controllers
const homeController = require('./controllers/homeController')
const authController = require('./controllers/authController')

const port = process.env.PORT
const db_URI = process.env.MONGO_URI

// middleware definitions and configurations
app.use(helmet())
app.use(helmet.contentSecurityPolicy({  // overriding helmet's default Content Security Policy to allow loading of resources from trusted domains
    directives: {
        "default-src" : ["'self'"],
        "script-src" : ["'self'", "https://cdn.jsdelivr.net"],
        "img-src": ["'self'", "https://i.pravatar.cc", "https://avatar.iran.liara.run"]
    },
}),)

app.use(methodOverride('_method')) // to override default html form method into other methods like DELETE, PUT or PATCH, which will be specified with the key '_method' in the html form as query parameter
app.use(express.json())        // to look for JSON data in ALL incoming requests and parse it to javascript object notation
app.use(express.urlencoded()) // to look for application/x-www-form-urlencoded data in ALL incoming requests and parse it to javascript object notation
app.use(express.static(path.join(__dirname, 'public'))) // making the 'public' folder public so that server can serve the files in that folder to the browser

app.use(session({    // express-session initialization (global middleware)
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false
    }
}))

app.use(flash())  //'connect-flash' for flash messages

// setting template engine engine
app.set('view engine', 'ejs')

// (route specific middlwares)
app.use('/post', postRouter) 
app.use('/admin', adminRoutes)
app.use('/register', authRoutes)

// route handlers
app.get('/', homeController.welcomeMessage)  // handling '/localhost:<port>/' GET request
app.get('/login', homeController.loginPage)  // handling '/localhost:<post>/login' GET request
app.post('/login', authController.loginUser) // handling '/localhost:<port>/login' POST request
app.post('/logout', authController.logoutUser) // handling '/localhost:<port>/logout' POST request



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