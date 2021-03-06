const shortid = require('shortid');
const GameRoom = require('./GameRoom');

/*

        lobby = array of websocket connections
 */
class GameServer {
    constructor() {
        this.rooms = {};
        this.lobby = [];
        this.heartbeatInterval = setInterval(() => {
            // This is the garbage cleanup interval
            console.log('Server is still good... Performing Garbage duties.');
            // check all rooms for [ room.isCompleted === true ]
            for (let each in this.rooms) {
                const thisGame = this.rooms[each];
                // remove room if it is done
                if (thisGame.isCompleted === true) {
                    console.log(`deleting ${thisGame.gameId}`);
                    delete this.rooms[thisGame.gameId];
                }
            }
        }, 30000);
    }

    addToLobby(pConnection) {
        this.lobby.push(pConnection);
        console.log(`${pConnection} has joined the Server`);
    }

    removeFromServer(pConnection) {
        // find the index value in the websocket array
        const index = this.lobby.indexOf(pConnection);

        // remove that connection from the websocket array
        if (index !== -1) {
            this.lobby.splice(index, 1);
            console.log(`${pConnection} has disconnected`);
        }

        // find the player and remove them from their game
        for (let each in this.rooms) {
            const thisGame = this.rooms[each];

            for (let every in thisGame.users) {
                const thisPlayer = thisGame.users[every];

                if (thisPlayer.connection === pConnection) {
                    thisGame.removeUser(thisPlayer);
                }
            }
        }
    }

    createRoom() {
        shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
        const code = shortid.generate();
        this.rooms[code] = new GameRoom(code);
        console.log(`Created Room # ${code}`);
        return code;
    }

    joinRoom(pRoom, pPlayer) {
        if (this.checkRoom(pRoom)) {
            this.rooms[pRoom].addUser(pPlayer);
            console.log(`${pPlayer.userId} has joined Room # ${pRoom}`);
            return true;
        } else {
            console.log(`${pRoom} does not exist...`);
            return false;
        }
    }

    // GETTERS
    // --------------------------------

    checkRoom(pRoom) {
        return this.rooms.hasOwnProperty(pRoom);
    }
}

module.exports = GameServer;