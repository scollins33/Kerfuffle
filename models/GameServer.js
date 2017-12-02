const shortid = require('shortid');
const GameRoom = require('./GameRoom');

class GameServer {
    constructor() {
        this.rooms = {};
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
}

module.exports = GameServer;