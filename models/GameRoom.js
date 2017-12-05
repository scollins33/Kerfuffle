const Questions = require('./db/questions');
const questionList = require('../db/trivia_db');
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
        this.inProgress = false;
        this.isCompleted = false;
    }

    // SETTERS
    // --------------------------------

    // Use Sequelize Questions model to get random questions
    // Should be an array for easy looping / tracking
    setQuestions(pNumber) {
        // sets up the vars in the function
        let numQs = pNumber;
        let randomQs = [];
        let usedIDs = [];
        let entries = 545;

        function getID() {
            let randID = Math.floor(Math.random() * entries);

            if (usedIDs.includes(randID)) {
                getID();
            } else {
                usedIDs.push(randID);
                return randID;
            }
        }

        // loops the number of times you told it to in the paramter
        for (let i = 0; i < numQs; i++) {
            // get a random number within 0 to the # of entries (from count query)
            let someID = getID();

            // add the question object to the array
            randomQs.push(questionList[someID]);
        }

        // after looping, set the array
        this.questions = randomQs;
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
    serveQuestion() {
        for (let each in this.users) {
            const thisPlayer = this.users[each];

            thisPlayer.inform('new-question',
                thisPlayer.userId,
                this.gameId,
                null,
                this.currentIndex,
                this.questions[this.currentIndex],
                null);
        }
    }

    runMain() {
        for (let each in this.users) {
            console.log(`Current Index for ${this.gameId} = ${this.currentIndex}`);
            const thisPlayer = this.users[each];
            const theirAnswer = thisPlayer.currentAnswer;
            const quesAnswer = this.questions[this.currentIndex].answer;

            if (theirAnswer === null) {
                thisPlayer.inform('result', thisPlayer.userId, this.gameId,
                    null, this.currentIndex, null, 'You did not submit an answer.');
            }
            else if (theirAnswer === quesAnswer) {
                thisPlayer.score += 1;
                thisPlayer.inform('result', thisPlayer.userId, this.gameId,
                    null, this.currentIndex, null, 'You got it right!');
            }
            else {
                thisPlayer.inform('result', thisPlayer.userId, this.gameId,
                    null, this.currentIndex, null, 'You got it wrong!');
            }

            thisPlayer.clearAnswer();
        }

        this.updatePlayers();
    }

    // Start the game Interval to run main logic
    startGame() {
        // this = GameRoom
        if (this.intervalId === null) {
            this.setQuestions(10);
            this.checkQuestions();

            for (let each in this.users) {
                const thisPlayer = this.users[each];

                thisPlayer.inform('starting-game',
                    thisPlayer.userId, this.gameId, null, null, null, null);
            }

            // serve 1st questions (index 0)
            this.serveQuestion();

            this.intervalId = setInterval(() => {
                // this = GameRoom

                // Run Main Logic for this round
                console.log(`RUNNING MAIN FOR ${this.gameId}`);
                this.runMain();

                // Iterate up to the next question
                this.currentIndex += 1;

                // If the index is past the array length, game is over
                if (this.currentIndex >= this.questions.length) {
                    this.endGame();
                } else {
                    // serve next question
                    this.serveQuestion();
                }
            }, 15000)
        }
    }

    // Adds user to the room
    addUser(pUser) {
        this.users[pUser.userId] = pUser;
        this.updatePlayers();
    }

    // Removes user from the the room
    removeUser(pUser) {
        console.log(`${pUser.userId} has left Room # ${this.gameId}.`);
        delete this.users[pUser.userId];
    }

    updatePlayers() {
        // build the player list with scores
        let playerArray = Object.keys(this.users);
        let playerList = [];

        playerArray.forEach((each) => {
            playerList.push([
                this.users[each].userId,
                this.users[each].score
            ]);
        });

        // notify each player
        for (let each in this.users) {
            const thisPlayer = this.users[each];

            thisPlayer.inform('player-update',
                thisPlayer.userId,
                this.gameId,
                playerList,
                null, null, null);
        }
    }

    // End the Interval (game over)
    endInterval() {
        clearInterval(this.intervalId);
    }

    // close all User connections
    closeConnections() {
        for (let each in this.users) {
            const thisPlayer = this.users[each];
            thisPlayer.connection.close();
        }
    }

    // End the game
    // Total the scores, present the results, clear the Interval, etc
    endGame() {
        console.log(`${this.gameId} HAS ENDED`);
        this.endInterval();
        this.closeConnections();
        this.isCompleted = true;
    }


    // GETTERS
    // --------------------------------

    checkQuestions() {
        console.log(this.questions);
    }
}

module.exports = GameRoom;