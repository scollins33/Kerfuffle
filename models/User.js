const shortid = require('shortid');

class User {
    constructor(pConnection) {
        this.userId = `Anon_${shortid.generate()}`;
        this.wsId = pConnection;
    }

    getUserId() {
        return this.userId;
    }

    getWS() {
        return this.wsId;
    }
}

module.exports = User;