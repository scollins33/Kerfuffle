// Network/Server Imports
const http = require('http');
const Websocket = require('ws');
const app = require('./app');
const db = require('./models/db');


// Game Imports
const GameServer = require('./models/GameServer');
const User = require('./models/User');


// Set Port
const PORT = process.env.PORT || 3000;

// create HTTP Server and Websocket Server
const server = http.createServer(app);
const wsserver = new Websocket.Server({ server });

// Initialize the Game Server
const GameInstance = new GameServer();

db.sequelize.sync({ force: true })
  .then(function() {
    // Start the HTTP Server
    server.listen(PORT, () => {
      console.log(`Server started on Port ${PORT}`);
    });
});

// Websocket Server events
wsserver.on('connection', (conn) => {

    // when you receive a message, flow into switch case
    conn.on('message', (message) => {
        console.log(`Received Message from Client: ${message}`);
        console.log(`Decoded Message from Client: ${decode(message)}`);

        const data = decode(message);

        switch (data.type) {
            case 'joining':
                const player = new User(conn);

                console.log(`Sending ${player} to the Lobby`);
                GameInstance.joinLobby(player);

                tellClient(player.connection,
                    'welcome',
                    player.userId,
                    null, GameInstance.lobby, null, null, null);
                break;
            default:
                console.log('Received a message but could not understand it');
        }
    });

});


// HELPER FUNCTIONS
// --------------------------------

// Package Message & Send
function tellClient (pClient, pType, pUser, pGame, pPlayers, pQuestionId, pQuestionInfo, pCommand) {
    pClient.send(
        JSON.stringify({
            type: pType,
            userId: pUser,
            gameId: pGame,
            playerList: pPlayers,
            questionId: pQuestionId,
            questionInfo: pQuestionInfo,
            command: pCommand
        })
    );
}

// Decode Message
function decode (pMessage) {
    return JSON.parse(pMessage);
}