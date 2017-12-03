// set your JQuery variables
const players = $('#players');
const question = $('#question');
const ansA = $('#ansA');
const ansB = $('#ansB');
const ansC = $('#ansC');
const ansD = $('#ansD');

let me = 'TEST_PLAYER';
let myGame = 'SHORTID';
let thisQuestion = null;
let myAns = null;

// Set your Websocket
window.WebSocket = window.WebSocket || window.MozWebSocket;

// IIFE to connect to websocket and handle button events
(() => {
    // HELPER FUNCTIONS
    // --------------------------------

    // Package Message & Send
    function tellServer (pType, pUser, pGame, pQuestion, pAnswer, pCommand) {
        const msg = JSON.stringify({
            type: pType,
            userId: pUser,
            gameId: pGame,
            questionId: pQuestion,
            answerChoice: pAnswer,
            command: pCommand
        });

        console.log(`Telling Server: ${msg}`);
        connection.send(msg);
    }

    // Decode Message
    function decode (pMessage) {
        return JSON.parse(pMessage.data);
    }

    // Update Player Roster
    function updatePlayers(pPlayerList) {
        pPlayerList.forEach((each) => {
            players.append(`<li>${each}</li>`)
        });
    }

    // Update Question & Answers
    function updateQuestion (pQuestion, pA, pB, pC, pD) {
        question.html(pQuestion);
        ansA.html(pA);
        ansB.html(pB);
        ansC.html(pC);
        ansD.html(pD);
    }

    // WEBSOCKET CODE
    // --------------------------------

    // log that we're trying
    console.log('Attempting to connect to WebSocket server...');

    // localhost used for testing
    // location.host gives us the PORT
    // location.hostname doesnt use PORT (this is for Heroku)
    let wsURL;
    if (location.hostname === 'localhost') {
        wsURL = location.host;
    } else {
        wsURL = location.hostname
    }

    // set the gameId
    myGame = location.pathname.slice(7);

    // create the connection
    const connection = new WebSocket('ws://' + wsURL);

    // when we open the connection alert in the console
    // asks to be assigned a userId & tells what game to be assigned to
    connection.onopen = function () {
        console.log('We got a connection!');
        tellServer('joining',
            null,
            myGame,
            null,
            null,
            null);
    };

    // listener for messages from the server
    connection.onmessage = function (message) {
        // take the message we receive and parse the JSON from it
        console.log(`Raw Message from Server: ${message}`);
        const data = decode(message);
        console.log(`Decoded Message from Server: ${data}`);
        console.log(data);

        // switch case to handle incoming messages
        switch (data.type) {
            // welcome from server, set userId
            case 'welcome':
                me = data.userId;
                console.log(`My username: ${me}`);
                console.log(`My Room #: ${myGame}`);
                break;
            // broadcast of the players in the room
            case 'player-update':
                updatePlayers(data.playerList);
                break;
            // broadcast when a new question is pushed
            case 'new-question':
                updateQuestion(data.questionInfo.questionText,
                    data.questionInfo.answerA,
                    data.questionInfo.answerB,
                    data.questionInfo.answerC,
                    data.questionInfo.answerD);
                break;
            default:
                console.log('Received a message but could not understand it');
                console.log(data);
        }
    };


    // JQUERY EVENT LISTENERS
    // --------------------------------

    $('button').on('click', function () {
        myAns = $(this).attr('value');
        tellServer('answer',
            me,
            myGame,
            thisQuestion,
            myAns,
            null);
    });

})();