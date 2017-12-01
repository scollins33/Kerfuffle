const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const PlayerStrategy = require('./lib/anonym-shortid').Strategy;

// var connection = mysql.createConnection({
//     host: "localhost",
//     port: 3306,
//
//     // Your username
//     user: "root",
//
//     // Your password
//     password: "",
//     database: "blank for right now"
// });
//
// connection.connect(function(err) {
//     if (err) throw err;
//     console.log("connected as id " + connection.threadId + "\n");
//     createProduct();
// });

let routes = require('./routes/index');
let users = require('./routes/users');

//Init App and HTTP server
let app = express();

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layouts'}));
app.set('view engine', 'handlebars');

//BodyParser Middleware
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
app.use(passport.initialize());
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

app.use(express.static('public'));
app.use('/', routes);
app.use('/users', users);

module.exports = app;
