const http = require('http');
const Websocket = require('ws');
const app = require('./app');

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