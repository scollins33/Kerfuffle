const shortid = require('shortid');

class User {
    constructor(pConnection) {
        this.userId = `Anon_${shortid.generate()}`;
        this.connection = pConnection;
    }

    // GETTERS
    // --------------------------------

    getUserId() {
        return this.userId;
    }

    getWS() {
        return this.wsId;
    }
}

module.exports = User;