// set your JQuery variables
let connect = $('#connect');
let display = $('#msg');
let sendmsg = $('#sendmsg');
let usermsg = $('#userMessage');
let newroom = $('#newRoom');
let roomcode = $('#roomCode');
let joinroom = $('#joinRoom');

// set your websocket
window.WebSocket = window.WebSocket || window.MozWebSocket;

// create the click event listener for the connection button
connect.on('click', function () {
    // log that we're trying
    console.log('Attempting to connect to WebSocket part of server...');

    // localhost used for testing
    // location.host gives us the PORT
    // location.hostname doesnt use PORT (this is for heroku)
    let wsURL;
    if (location.hostname === 'localhost') {
        wsURL = location.host;
    } else {
        wsURL = location.hostname
    }

    // create the connection variable
    // use the 'ws://' so that the HTTP server upgrades the request to use the WebSocket standard
    let connection = new WebSocket('ws://' + wsURL);

    let myRoom = null;

    // when we open the connection, write to the console so we know it happened
    connection.onopen = function () {
        console.log('We got a connection!');
    };

    // listener for messages from the server
    connection.onmessage = function (message) {
        // take the message we receive and parse the JSON from it
        let json = JSON.parse(message.data);

        // switch case to handle the type of message being sent from the server
        // this type is completely arbitrary, I created it on the server side to test switching on messaging
        // change the span's html to the text sent from the server
        switch (json.type) {
            case 'welcome':
                display.html(json.msg);
                break;
            case 'info':
                display.append(json.msg);
                break;
            case 'room-data':
                myRoom = json.room;
                console.log(`Joined Game Room ${myRoom}`);
                break;
            default:
                display.html('recieved a message but couldnt understand it');
        }

    };

    // create a listener for when the user clicks the send button
    // then use the connection to send a stringified JSON object to the server
    // type is arbitrary again - I didn't add anything on the server to check, only 'msg'
    sendmsg.on('click', function () {
        // websockets deal in UTF8
        connection.send(JSON.stringify({
            type: 'alert',
            msg: usermsg.val().trim()
        }));
    });

    newroom.on('click', function () {
        connection.send(JSON.stringify({
            type: 'newroom'
        }));
    });

    joinroom.on('click', function () {
        connection.send(JSON.stringify({
            type: 'join-request',
            room: roomcode.val().trim()
        }));
    })
});

