// Require Question model
const Questions = require('../models/db/Questions.js');

/*
    gameId
        > shortid of the game, also the key value in the GameServer
    questions
        > Array of Question objects
    users
        > Object of User objects
    currentIndex
        > Index of the questions array (current round)
    intervalId
        > Interval to trigger main logic
 */

class GameRoom {
    // Constructor
    // Takes shortid generated as its name
    constructor(pID) {
        this.gameId = pID;
        this.questions = [];
        this.users = {};
        this.currentIndex = 0;
        this.intervalId = null;
    }

    // SETTERS
    // --------------------------------

    // Use Sequelize Questions model to get random questions
    // Should be an array for easy looping / tracking
    setQuestions() {
        const testQs = [{
            "question": "A flashing red traffic light signifies that a driver should do what?",
            "A": "stop",
            "B": "speed up",
            "C": "proceed with caution",
            "D": "honk the horn",
            "answer": "A"
        }, {
            "question": "A knish is traditionally stuffed with what filling?",
            "A": "potato",
            "B": "creamed corn",
            "C": "lemon custard",
            "D": "raspberry jelly",
            "answer": "A"
        }];

        this.questions = testQs;
    }

    // Main Game Logic
    /*
    On Each Interval (main logic):
		Tally scores for all user.gameId === gameId
			Evaluate user.answer vs game.question.answer
			Clear user.answer (null)
		Update Leaderboard
		Update game.questionId
		Push new question out
     */
    runMain() {
        console.log(`Current Round: ${this.getRound()}`);
    }

    // Start the game Interval to run main logic
    // 15 seconds = 900,000 milliseconds
    startInterval() {
        if (this.intervalId === null) {
            this.intervalId = setInterval(() => {
                // Run Main Logic for this round
                this.runMain();

                // Iterate up to the next question
                this.currentIndex += 1;
            }, 900000)
        }
    }

    // End the Interval (game over)
    endInterval() {
        clearInterval(this.intervalId);
    }

    //
    addUser(pUser) {
        this[pUser] = pUser;
    }


    // GETTERS
    // --------------------------------

    getRound() {
        return this.currentIndex;
    }

    getQuestions() {
        return this.questions;
    }

    getUsers() {
        return this.users;
    }
}

module.exports = GameRoom;