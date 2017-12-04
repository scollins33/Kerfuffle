const Questions = require('./db/Questions');

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
    inProgress
        > true = valid game, should stay in server list
        > false = remove game on next cleanup of Server
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
        this.inProgress = true;
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
        // this = GameRoom
        console.log(`Current Round: ${this.currentIndex}`);
        console.log(`currentIndex: ${this.currentIndex}`);
        console.log(`current Q answer: ${this.questions[this.currentIndex].answer}`);
        for (let each in this.users) {
            let thisPlayer = this.users[each];
            console.log(thisPlayer.currentAnswer);
            if (thisPlayer.currentAnswer === null) {
                console.log(`${thisPlayer.userId} has no answer`);
            }
            else if (thisPlayer.currentAnswer === this.questions[this.currentIndex].answer) {
                thisPlayer.score += 1;
                thisPlayer.inform('result', thisPlayer.userId, this.gameId,
                    null, this.currentIndex, null, 'You got it right!');
            }
            else {
                thisPlayer.inform('result', thisPlayer.userId, this.gameId,
                    null, this.currentIndex, null, 'You got it wrong!');
            }

            thisPlayer.clearAnswer();
            console.log(thisPlayer.currentAnswer);
            console.log(thisPlayer.score);

            // push new question
        }
    }

    // Start the game Interval to run main logic
    // 15 seconds = 900,000 milliseconds
    startGame() {
        // this = GameRoom
        if (this.intervalId === null) {
            this.setQuestions();
            this.checkQuestions();

            this.intervalId = setInterval(() => {
                console.log('RUNNING INTERVAL');
                // this = GameRoom
                // Run Main Logic for this round
                this.runMain();

                // Iterate up to the next question
                this.currentIndex += 1;

                // If the index is past the array length, game is over
                if (this.currentIndex >= this.questions.length) {
                    this.endGame();
                }
            }, 15000)
        }
    }

    // End the Interval (game over)
    endInterval() {
        clearInterval(this.intervalId);
    }

    // Adds user to the room
    addUser(pUser) {
        this.users[pUser.userId] = pUser;
    }

    // Removes user from the the room
    removeUser(pUser) {
        delete this.users[pUser];
        console.log(`${pUser} has left the game room.`);
    }

    // End the game
    // Total the scores, present the results, clear the Interval, etc
    endGame() {
        console.log(`${this.gameId} HAS ENDED`);
        this.endInterval();
        this.inProgress = false;
    }


    // GETTERS
    // --------------------------------

    getQuestions() {
        return this.questions;
    }

    getUsers() {
        return this.users;
    }

    checkQuestions() {
        console.log(this.questions);
    }
}

module.exports = GameRoom;