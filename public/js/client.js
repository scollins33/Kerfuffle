// set your JQuery variables
const players = $('#players');
const question = $('#question');
const ansA = $('#ansA');
const ansB = $('#ansB');
const ansC = $('#ansC');
const ansD = $('#ansD');

// set your websocket
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

    // WEBSOCKET CODE
    // --------------------------------

    // log that we're trying
    console.log('Attempting to connect to WebSocket server...');

    // localhost used for testing
    // location.host gives us the PORT
    // location.hostname doesnt use PORT (this is for heroku)
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
    };

    // listener for messages from the server
    connection.onmessage = function (message) {
        // take the message we receive and parse the JSON from it
        const data = decode(message);

        // switch case to handle incoming messages
        switch (json.type) {
            case 'welcome':
                question.html(json.msg);
                break;
            case 'info':
                players.append(json.msg);
                break;
            case 'room-data':
                myRoom = json.room;
                console.log(`Joined Game Room ${myRoom}`);
                break;
            default:
                console.log('Recieved a message but couldnt understand it');
                console.log(data);
        }
    };

    // JQUERY EVENT LISTENERS
    // --------------------------------

    $('button').on('click', function () {
        const myAns = this.attr('value');
        const msg = encode('answer',
            me,
            thisGame,
            thisQuestion,
            myAns,
            null);

        connection.send(msg);
    });

})();

