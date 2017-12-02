// Network/Server Imports
const http = require('http');
const Websocket = require('ws');
const app = require('./app');

// Game Imports
const GameServer = require('./models/GameServer');
const User = require('./models/User');


// Set Port
const PORT = process.env.PORT || 3000;

// create HTTP Server and Websocket Server
const server = http.createServer(app);
const wsserver = new Websocket.Server({ server });

// Initialize the Game Server
const GameServer = new GameServer();

// Start the HTTP Server
server.listen(PORT, () => {
    console.log(`Server started on Port ${PORT}`);
});

// Websocket Server events
wsserver.on('connection', (client) => {

    // when you receive a message, flow into switch case
    client.on('message', (message) => {
        console.log(decode(message));

        const data = decode(message);

        switch (data.type) {
            case 'joining':
                const player = new User(client);
                const msg = encode('welcome',
                    player.getUserId());

                client.send(msg);
                break;
            default:
                console.log('Received a message but could not understand it');
        }
    });


});


// HELPER FUNCTIONS
// --------------------------------

// Package Message
function encode (pType, pUser, pGame, pQuestion, pAnswer, pCommand) {
    return JSON.stringify({
        type: pType,
        userId: pUser,
        gameId: pGame,
        questionId: pQuestion,
        answerChoice: pAnswer,
        command: pCommand
    });
}

// Decode Message
function decode (pMessage) {
    return JSON.parse(pMessage.data);
}

// Build User