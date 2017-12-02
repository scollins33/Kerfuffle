// Require Question model 



let GameRoom = function (pID) {
    this.roomCode = pID;
    this.users = [];
    this.isActive = true;
};

GameRoom.prototype.addUser = function (pConnection) {
    this.users.push(pConnection);
};

GameRoom.prototype.getQuestions = function () {
    // temporary until we have a SQLZ ORM to get ten random questions
    this.questionArray = [
        {
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
        }, {
            "question": "A pita is a type of what?",
            "A": "fresh fruit",
            "B": "flat bread",
            "C": "French tart",
            "D": "friend bean dip",
            "answer": "B"
        }, {
            "question": "A portrait that comically exaggerates a person's physical traits is called a what?",
            "A": "landscape",
            "B": "caricature",
            "C": "still life",
            "D": "Impressionism",
            "answer": "B"
        }, {
            "question": "A second-year college student is usually called a what?",
            "A": "sophomore",
            "B": "senior",
            "C": "freshman ",
            "D": "junior ",
            "answer": "A"
        }
    ]
};


module.exports = GameRoom;