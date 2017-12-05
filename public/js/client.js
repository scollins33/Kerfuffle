// set your JQuery variables
const players = $('#players');
const myname = $('#thisPlayer');
const startGame = $('#startGame');
const resultText = $('#resultText');
const timer = $('#timeLeft');
const question = $('#question');
const ansA = $('#ansA');
const ansB = $('#ansB');
const ansC = $('#ansC');
const ansD = $('#ansD');

let me = null;
let myGame = null;
let thisQuestion = null;
let myAns = null;

// Set your Websocket
window.WebSocket = window.WebSocket || window.MozWebSocket;

// IIFE to connect to websocket and handle button events
(() => {
    // HELPER FUNCTIONS
    // --------------------------------

    // Package Message & Send
    function tellServer (pType, pCommand) {
        const msg = JSON.stringify({
            type: pType,
            userId: me,
            gameId: myGame,
            questionId: thisQuestion,
            answerChoice: myAns,
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
        players.empty();
        pPlayerList.forEach((each) => {
            players.append(`<li>
                <span class="playerName">${each[0]}</span> | 
                <span class="playerScore">${each[1]}</span>
                </li>`);
        });
    }

    // Update Question & Answers
    function updateQuestion (pQID, pQTEXT, pA, pB, pC, pD) {
        thisQuestion = pQID;
        question.html(pQTEXT);
        ansA.html(pA);
        ansB.html(pB);
        ansC.html(pC);
        ansD.html(pD);
    }

    // Round Timer to display time remaining until server sends new question
    function startTimer() {
        let ticker = 15;
        timer.html(`Time Left: ${ticker}`);

        let thisRoundTimer = setInterval(() => {
            ticker -= 1;
            timer.html(`Time Left: ${ticker}`);
        }, 1000);

        setTimeout(function() {
            clearInterval(thisRoundTimer);
            }, 15000);
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
    $('#thisLobby').html(myGame);

    // create the connection
    const connection = new WebSocket('ws://' + wsURL);

    // when we open the connection alert in the console
    // asks to be assigned a userId & tells what game to be assigned to
    connection.onopen = function () {
        console.log('We got a connection!');
        tellServer('joining',
            null, null, null);
    };

    connection.onclose = function () {
        resultText.html('Game Over!');
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
                myname.html(me);
                console.log(`My username: ${me}`);
                console.log(`My Room #: ${myGame}`);
                break;
            // broadcast of the players in the room
            case 'player-update':
                updatePlayers(data.playerList);
                break;
            case 'starting-game':
                $('#startRow').addClass('hide-this');
                $('#gameTable').removeClass('hide-this');
                resultText.html('Game has started!');
                break;
            case 'result':
                resultText.html(data.command);
                break;
            case 'new-question':
                updateQuestion(data.questionId,
                    data.questionInfo.question,
                    data.questionInfo.A,
                    data.questionInfo.B,
                    data.questionInfo.C,
                    data.questionInfo.D);
                startTimer();
                break;
            default:
                console.log('Received a message but could not understand it');
                console.log(data);
        }
    };


    // JQUERY EVENT LISTENERS
    // --------------------------------
    startGame.on('click', function () {
        tellServer('start-game', null, null, 'start');
    });

    $('.answer').on('click', function () {
        myAns = $(this).attr('value');
        tellServer('answer',
            thisQuestion, myAns, null);
    });

})();