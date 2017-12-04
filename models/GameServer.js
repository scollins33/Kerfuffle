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
            console.log('Server is still good');
            // check all connections to remove dead ones
                // if you find a dead one check all players
                    // remove dead player
        }, 30000);
    }

    addToLobby(pConnection) {
        this.lobby.push(pConnection);
        console.log(`${pConnection} has joined the Server`);
    }

    removeFromLobby(pConnection) {
        // find the index value in the websocket array
        const index = this.lobby.indexOf(pConnection);

        // remove that connection from the websocket array
        if (index !== -1) {
            this.lobby.splice(index, 1);
            console.log(`${pConnection} has disconnected`);
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
        if (this.rooms.hasOwnProperty(pRoom)) {
            this.rooms[pRoom].addUser(pPlayer);
            console.log(`${pPlayer.userId} has joined Room # ${pRoom}`);
        } else {
            console.log(`${pRoom} does not exist...`);
            return false;
        }
    }

    // GETTERS
    // --------------------------------

    getRooms() {
        return this.rooms;
    }

    checkRoom(pRoom) {
        return this.rooms.hasOwnProperty(pRoom);
    }
}

module.exports = GameServer;