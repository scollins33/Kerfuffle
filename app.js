/*
App File
    Generates Express App with all middleware applied
 */

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const genericRoutes = require('./controllers/generic-routes');
const userRoutes = require('./controllers/user-routes');

// Init App
const app = express();

// View Engine - Handlebars
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layouts'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());

// //Set Static Folder
// app.use(session({
//     secret: 'secret',
//     saveUninitialized: true,
//     resave: true
// }));


//Passport init
// app.use(passport.initialize());
// app.use(passport.session());


// //Express Validator
// app.use(expressValidator({
//     errorFormatter: function(param, msg, value) {
//         let namespace = param.split('.')
//             , root = namespace.shift()
//             , formParam = root;
//         while(namespace.length) {
//             formParam += '[' + namespace.shift() * ']';
//         }
//         return {
//             param : formParam,
//             msg : msg,
//             value : value
//         };
//     }
// }));
//
// //connect flash middleware
// app.use(flash());
//
// //Global Vars
// app.use(function(req, res, next){
//     res.locals.success_msg = req.flash('success_msg');
//     res.locals.errors_msg = req.flash('error_msg');
//     res.locals.error = req.flash('error');
//     next();
// });

// Attach the static Public folder
// bring in the routers
app.use(express.static('public'));
app.use('/', genericRoutes);
app.use('/users', userRoutes);


module.exports = app;