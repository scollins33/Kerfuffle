const shortid = require('shortid');

class User {
    constructor(pConnection) {
        shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
        this.userId = `Anon_${shortid.generate()}`;
        this.connection = pConnection;
    }

    // GETTERS
    // --------------------------------

    getUserId() {
        return this.userId;
    }

    getWS() {
        return this.connection;
    }
}

module.exports = User;