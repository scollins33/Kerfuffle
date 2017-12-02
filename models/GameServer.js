const shortid = require('shortid');
const GameRoom = require('./GameRoom');

// lobby is an object of Users waiting to be moved to GameRooms
class GameServer {
    constructor() {
        this.rooms = {};
        this.lobby = {};
    }

    joinLobby(pUser) {
        this.lobby[pUser] = pUser;
        console.log(`${pUser.userId} has joined the Lobby`);
    }

    createRoom() {
        const code = shortid.generate();
        this.rooms[code] = new GameRoom(code);
    }

    joinRoom(pRoom, pConnection) {
        if (this.rooms.hasOwnProperty(pRoom)) {
            this.rooms[pRoom].addUser(pConnection);
        } else {
            return false;
        }
    }

    // Move User from Lobby to Room

    // GETTERS
    // --------------------------------

    getLobby() {
        return this.lobby;
    }
}

module.exports = GameServer;