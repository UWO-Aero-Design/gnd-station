const WebSocket = require('ws');
const { Message } = require('../message/message_pb')

const port = process.env.WS_PORT;

const wss = new WebSocket.Server({ port });

console.log(`Websocket started on port ${port}`)

wss.on('connection', (ws) => {
    console.log('Connected to frontend')
    ws.on('message', (message) => {
        message = JSON.parse(message);
        // console.log('Received message')
    })
})
