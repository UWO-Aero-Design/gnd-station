const WebSocket = require('ws');
// const { device } = require('./usb');
const { Message } = require('../message/message_pb')

const port = process.env.WS_PORT;

const wss = new WebSocket.Server({ port });

console.log(`Websocket started on port ${port}`)

wss.on('connection', (ws) => {
    console.log('Connected to frontend')
    ws.send(JSON.stringify({ recipient: 'USB_TOOL', type: 'LIST_DEVICES' } ));
    ws.on('message', (message) => {
        message = JSON.parse(message);
        console.log('Received message')
    })

    // device.on('data', (data) => {
    //     ws.send(JSON.stringify(data))
    // })

})