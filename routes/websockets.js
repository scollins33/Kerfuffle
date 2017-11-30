module.exports = function (request) {
    // create a connection when accepting the websocket request
    let connection = request.accept(null, request.origin);
    // add the connection to the array
    wsConnections.push(connection);

    // log that the connection happened
    console.log(`${connection.remoteAddress} connected using ${connection.webSocketVersion}`);

    // immediately send a message to the client using the new connection
    connection.sendUTF(JSON.stringify({
        type: 'welcome',
        msg: 'Welcome to the server! You have joined a new room'
    }));

    // set up the listener for messages from the client connection
    connection.on('message', (message) => {
        // need to use the utf8Data section - since we stringify JSON you need to parse it
        console.log(JSON.parse(message.utf8Data).msg);

        // send a message back to the client connection saying we get the message
        // this is unnecessary but proves the 2 way connection - at this point you're emulating the Request/Response paradigm
        // send UTF of a stringfied JSON object
        connection.sendUTF(
            JSON.stringify(
                {
                    type: 'info',
                    msg: '\n I got your message'
                }
            )
        );
    });

    // listener for the connection closer
    connection.on('close', function () {
        // log we're closing
        console.log(connection.remoteAddress + " disconnected");

        // find the index value in the websocket array
        let index = wsConnections.indexOf(connection);

        // remove that connection from the websocket array
        if (index !== -1) {
            // remove the connection from the pool
            wsConnections.splice(index, 1);
        }
    })
}