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

// Initialize the Game Server & connections array
const GameInstance = new GameServer();


// POST to room route
// this route is here since it needs access to GameInstance
app.post('/rooms/:id', (req, res) => {
    // if id is new, create a new room
    if (req.params.id === 'new') {
        const newRoom = GameInstance.createRoom();
        res.redirect(`/rooms/${newRoom}`);
    } else {
        const targetRoom = req.params.id;
        // check if the room exists
        if (GameInstance.checkRoom(targetRoom)) {
            // if it does, send response so AJAX can redirect
            res.send(`/rooms/${targetRoom}`);
        } else {
            // if it does not, render main page again
            res.render('index');
        }
    }
});

// GET to room route
// this route is here since it needs access to GameInstance
// Having this route here allows us to handle people refreshing a link or using an expired room
app.get('/rooms/:id', (req, res) => {
    const targetRoom = req.params.id;
    // check if the room exists
    if (GameInstance.checkRoom(targetRoom)) {
        // render the game room since it's valid
        res.render('gameroom');
    } else {
        // if it does not, render main page again
        res.render('index');
    }
});



// Sync Sequelize & Start the HTTP Server
db.sequelize.sync({ force: true })
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server started on Port ${PORT}`);
        });
    });


// Websocket Server events
wsserver.on('connection', (conn) => {
    GameInstance.addToLobby(conn);

    // when you receive a message, flow into switch case
    conn.on('message', (message) => {
        const data = decode(message);

        switch (data.type) {
            // handle new users connecting for the 1st time
            // produce userId and join named gameId
            case 'joining':
                const theirGame = data.gameId;
                const player = new User(conn);

                console.log(`Sending ${player.userId} to the ${theirGame} lobby`);
                const hasJoined = GameInstance.joinRoom(theirGame, player);
                if (hasJoined) {
                    // Tell user their ID
                    tellClient(player.connection,
                        'welcome',
                        player.userId,
                        theirGame, null, null, null, null);
                } else {
                    // Reject and close connections
                }

                break;
            // notification from the lobby players to start the game
            case 'start-game':
                console.log(`Received Start command for ${data.gameId}`);
                GameInstance
                    .rooms[data.gameId].startGame();
                break;
            // process answers as they flow in from players
            case 'answer':
                GameInstance
                    .rooms[data.gameId]
                    .users[data.userId].setAnswer(data.answerChoice);
                break;
            default:
                console.log('Received a message but could not understand it');
        }
    });

    // listener for the connection closer
    conn.on('close', () => {
        GameInstance.removeFromServer(conn);
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


// Routes
// =============================================================
require("./routes/routes.js")(app);







