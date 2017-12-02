// set your JQuery variables
const players = $('#players');
const question = $('#question');
const ansA = $('#ansA');
const ansB = $('#ansB');
const ansC = $('#ansC');
const ansD = $('#ansD');

let me = 'TEST_PLAYER';
let thisGame = 'SHORTID';
let thisQuestion = null;
let myAns = null;

// Set your Websocket
window.WebSocket = window.WebSocket || window.MozWebSocket;

// IIFE to connect to websocket and handle button events
(() => {
    // HELPER FUNCTIONS
    // --------------------------------

    // Package Message
    function encode (pType, pUser, pGame, pQuestion, pAnswer, pCommand) {
        return JSON.stringify({
            type: pType,
            userId: pUser,
            gameId: pGame,
            questionId: pQuestion,
            answerChoice: pAnswer,
            command: pCommand
        });
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

    // create the connection
    // when we open the connection alert in the console
    const connection = new WebSocket('ws://' + wsURL);
    connection.onopen = function () {
        console.log('We got a connection!');

        const msg = encode('joining',
            null,
            null,
            null,
            null,
            null);

        connection.send(msg)
    };

    // listener for messages from the server
    connection.onmessage = function (message) {
        // take the message we receive and parse the JSON from it
        const data = decode(message);

        // switch case to handle incoming messages
        switch (data.type) {
            case 'welcome':
                me = data.userId;
                thisGame = data.gameId;
                break;
            case 'player-update':
                updatePlayers(data.playerList);
                break;
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
        const msg = encode('answer',
            me,
            thisGame,
            thisQuestion,
            myAns,
            null);

        connection.send(msg);
    });

})();