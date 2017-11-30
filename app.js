const http = require('http');
const express = require('express');
const WebSocketServer = require('websocket').server;
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mySql = require('mysql');

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

//Set Port
let PORT = process.env.PORT || 3000;

//Init App and HTTP server
let app = express();
let server = http.createServer(app);

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layouts'}));
app.set('view engine', 'handlebars');

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());

//Set Static Folder
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));


//Passport init
app.use(passport.initialize());
app.use(passport.session());


//Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        let namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;
        while(namespace.length) {
            formParam += '[' + namespace.shift() * ']';
        }
        return {
            param : formParam,
            msg : msg,
            value : value
        };
    }
}));

//connect flash middleware
app.use(flash());

//Global Vars
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.errors_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use(express.static('public'));
app.use('/', routes);
app.use('/users', users);


server.listen(PORT, () => {
    console.log(`Server started on Port ${PORT}`);
});


// create your websocket server using the HTTP server
const wsServer = new WebSocketServer({
    httpServer: server
});

// websocket array to manage all connections
let wsConnections = [];

// listen for websocket requests
wsServer.on('request', (request) => {
    // create a connection when accepting the websocket request
    let connection = request.accept(null, request.origin);
    // add the connection to the array
    wsConnections.push(connection);

    // log that the connection happened
    logit(`${connection.remoteAddress} connected using ${connection.webSocketVersion}`);

    // immediately send a message to the client using the new connection
    connection.sendUTF(JSON.stringify({
        type: 'welcome',
        msg: 'Welcome to the server! You have joined a new room'
    }));

    // set up the listener for messages from the client connection
    connection.on('message', (message) => {
        // need to use the utf8Data section - since we stringify JSON you need to parse it
        logit(JSON.parse(message.utf8Data).msg);

        // send a message back to the client connection saying we get the message
        // this is unnecessary but proves the 2 way connection - at this point you're emulating the Request/Response paradigm
        // send UTF of a stringfied JSON object
        connection.sendUTF(
            JSON.stringify(
                {
                    type: 'info',
                    msg: '\n I got your message'
                }
            )
        );
    });

    // listener for the connection closer
    connection.on('close', function () {
        // log we're closing
        console.log(connection.remoteAddress + " disconnected");

        // find the index value in the websocket array
        let index = wsConnections.indexOf(connection);

        // remove that connection from the websocket array
        if (index !== -1) {
            // remove the connection from the pool
            wsConnections.splice(index, 1);
        }
    })
});