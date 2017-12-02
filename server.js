const http = require('http');
const Websocket = require('ws');
const app = require('./app');
const db = require('./models/db');


// Set Port
const PORT = process.env.PORT || 3000;

// create HTTP Server and Websocket Server
const server = http.createServer(app);
const wsserver = new Websocket.Server({ server });

// Websocket Server events
wsserver.on('connection', (ws) => {

    // when you receive a message, flow into switch case
    ws.on('message', (message) => {
        console.log(message);
    });


});



// Start the HTTP Server
    server.listen(PORT, () => {
        console.log(`Server started on Port ${PORT}`);
    });



db.sequelize.sync({ force: true }).then(function() {
    app.listen(PORT, function() {
        console.log("App listening on PORT " + PORT);
    });
});


