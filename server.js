const http = require('http');
const WebSocketServer = require('websocket').server;
const mySql = require('mysql');

const GameServer = require('./models/GameServer');
const GameRoom = require('./models/GameRoom');
const app = require('./app');

//Set Port
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`Server started on Port ${PORT}`);
});

// create your websocket server using the HTTP server
const wsServer = new WebSocketServer({
    httpServer: server
});

// websocket array to manage all connections
let wsConnections = [];
let roomArray = [];

// running the games
// start game, games.push, setInterval if games.find( game with game.id === gameId and game.intervalId === undefined )

// on each interval, update game.questionId tally scores to leaderboard for all users with user.gameId === gameId (evaluate user.questionId, user.answer) and user.questionId === game.questionId

// game end: clearInterval(game.intervalId), set game.intervalId = null

// game = { questionIds: [3, 5, 6], id, intervalId, questionId }
// user = { gameId, userId, answer, questionId }
// const games = [], users = { [userId]: user };

// leaderBoard = { userId, totalScore } ... saved in the database

// listen for websocket requests
wsServer.on('request', (request) => {
    // create a connection when accepting the websocket request
    // add the connection to the array
    let connection = request.accept(null, request.origin);
    wsConnections.push(connection);

    // log that the connection happened
    console.log(`${connection.remoteAddress} has been granted a websocket`);
    console.log(connection);

    // immediately send a message to the client using the new connection
    connection.sendUTF(JSON.stringify({
        type: 'welcome',
        msg: 'Welcome to the server!'
    }));

    // set up the listener for messages from the client connection
    connection.on('message', (message) => {
        // get the data from the message
        let data = JSON.parse(message.utf8Data);

        switch (data.type) {
            case "alert":
                console.log(data.msg);
                break;
            case "newroom":
                roomArray.push(new GameRoom());
                console.log(`Room Array: ${roomArray}`);
                console.log(`Last room added: ${roomArray[roomArray.length-1]}`);
                sendRoom(connection, roomArray[roomArray.length-1]);
                break;
            case "join-request":
                joinRoom(connection, data.room);
                break;
            default:
                break;
        }
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

function sendRoom(pConnection, pRoom) {
    pConnection.sendUTF(JSON.stringify({
        type: 'room-data',
        room: pRoom.roomCode
    }));
}

function joinRoom(pConnection, pCode) {
    let joined = false;

    roomArray.forEach((each) => {
        if (pCode === each.roomCode) {
            each.users.push(pConnection);
            joined = true;
            sendRoom(pConnection, each);
        }
    });

    if (!joined) {
        pConnection.sendUTF(JSON.stringify({
            type: 'info',
            msg: 'There is no room with that code'
        }));
    }
}
