const shortid = require('shortid');
const GameRoom = require('GameRoom');

// let GameServer = function () {
//     this.rooms = {};
// };
//
// GameServer.prototype.createRoom = function () {
//     let code = shortid.generate();
//     this.rooms[code] = new GameRoom(code);
// };
//
// GameServer.prototype.joinRoom = function (pConnection, pRoom) {
//     if (this.rooms.hasOwnProperty(pRoom)) {
//         this.rooms[pRoom].addUser(pConnection);
//     } else {
//         return false;
//     }
// };

class GameServer {
    constructor() {
        this.rooms = {};
    }

    createRoom() {
        const code = shortid.generate();
        this.rooms[code] = new GameRoom(code);
    }

    joinRoom() {
        if (this.rooms.hasOwnProperty(pRoom)) {
            this.rooms[pRoom].addUser(pConnection);
        } else {
            return false;
        }
    }
}

module.exports = GameServer;