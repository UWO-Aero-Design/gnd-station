const WebSocket = require('ws');

const PRINT_CONNECT_MESSAGES = true;
const PRINT_DISCONNECT_MESSAGES = true;

// for singleton
let websocket;

// singleton return (requires options on init)
const get_websocket = (server) => {
    if(!websocket) {
        if(!server) {
            throw Error('No server provided')
        }
        websocket = create_websocket(server);
        console.log(`Websocket started on port ${server.address().port}`)
    }

    return websocket;
}

// creates websocket and sets up callbacks
const create_websocket = (server) => {
    wss = new WebSocket.Server({ server });
    
    wss.on('connection', (ws) => {
        if(PRINT_CONNECT_MESSAGES) {
            console.log(`Connected to client: ${ws._socket.remoteAddress}`)
        }

        ws.on('close', (code) => {
            if(PRINT_DISCONNECT_MESSAGES) {
                console.log(`Disconnected from client: ${ws._socket.remoteAddress} (code: ${code})`)
            }
        })
    })

    return wss;
}

module.exports = {
    get_websocket
};
