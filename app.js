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
const crypto = require('crypto')


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

app.use((req, res, next) => { // generating random nonce for each request
    res.locals.cspNonce = crypto.randomBytes(16).toString('base64');
    next();
});

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "default-src": ["'self'"],
            "script-src": ["'self'", "https://cdn.jsdelivr.net", (req, res) => `'nonce-${res.locals.cspNonce}'`],
            "img-src": ["'self'", "https://api.dicebear.com"],
            "connect-src": ["'self'", "https://cdn.jsdelivr.net"]
        }
    }
}
))

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

//initializing 'connect-flash' for flash messages
app.use(flash())

// custom middleware for assigning data to res.locals object
app.use(function (req, res, next) {

    // adding user's information to res.locals
    if (req.session.user) {
        res.locals.currentUser = {
            username: req.session.user.username,
            role: req.session.user.role,
            joinedDate: req.session.user.joinedDate,
            restrictionStatus: req.session.user.restrictionStatus,
            email: req.session.user.useremail
        }
    }

    // pulling all the flash messages from req.flash object and storing it in res.locals.flashMessages object
    res.locals.flashMessages = {
        success: req.flash('success'),
        failure: req.flash('failure'),
        info: req.flash('info')
    }
    next()
})

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


// starting server
app.listen(port)