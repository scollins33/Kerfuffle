/*
App File
    Generates Express App with all middleware applied
 */

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');

const db = require('./models/db');
const genericRoutes = require('./controllers/main-routes');

// Init App
const app = express();

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());

// Create Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

// View Engine - Handlebars
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layouts'}));
app.set('view engine', 'handlebars');

// Passport init
require('./controllers/auth.js')(app, passport);
require('./config/passport.js')(passport, db.admin);


// Attach the static Public folder
// bring in the routers
app.use(express.static('public'));
app.use('/', genericRoutes);


module.exports = app;