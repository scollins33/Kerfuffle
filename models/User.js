const shortid = require('shortid');

class User {
    constructor(pConnection) {
        shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
        this.userId = `Anon_${shortid.generate()}`;
        this.connection = pConnection;
        this.currentAnswer = null;
        this.score = 0;
    }

    setAnswer(pAnswer) {
        this.currentAnswer = pAnswer;
    }

    clearAnswer() {
        this.currentAnswer = null;
    }

    // GETTERS
    // --------------------------------

    getUserId() {
        return this.userId;
    }

    getWS() {
        return this.connection;
    }

    // Package Message & Send
    inform(pType, pUser, pGame, pPlayers, pQuestionId, pQuestionInfo, pCommand) {
        this.connection.send(
            JSON.stringify({
                type: pType,
                userId: pUser,
                gameId: pGame,
                playerList: pPlayers,
                questionId: pQuestionId,
                questionInfo: pQuestionInfo,
                command: pCommand
            })
        );
    }
}

module.exports = User;