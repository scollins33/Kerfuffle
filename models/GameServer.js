const shortid = require('shortid');
const GameRoom = require('./GameRoom');

// lobby is an object of Users waiting to be moved to GameRooms
class GameServer {
    constructor() {
        this.rooms = {};
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

    // Move User from Lobby to Room

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