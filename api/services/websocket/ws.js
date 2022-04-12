const WebSocket = require('ws');

const PRINT_CONNECT_MESSAGES = true;
const PRINT_DISCONNECT_MESSAGES = true;

const port = process.env.WS_PORT;

const wss = new WebSocket.Server({ port });

console.log(`Websocket started on port ${port}`)

wss.on('connection', (ws) => {
    if(PRINT_CONNECT_MESSAGES) {
        console.log(`Connected to frontend: ${ws._socket.remoteAddress}`)
    }

    ws.on('close', (code) => {
        if(PRINT_DISCONNECT_MESSAGES) {
            console.log(`Disconnected from frontend: ${ws._socket.remoteAddress} (code: ${code})`)
        }
    })
})

module.exports = wss;
