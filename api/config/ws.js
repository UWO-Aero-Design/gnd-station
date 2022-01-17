const WebSocket = require('ws');
// const { device } = require('./usb');
const { Message } = require('../message/message_pb')

const port = process.env.WS_PORT;

const wss = new WebSocket.Server({ port });

console.log(`Websocket started on port ${port}`)

wss.on('connection', (ws) => {
    console.log('Connected to frontend')
    ws.on('message', (message) => {
        message = JSON.parse(message);
        message.type = message.type.toUpperCase()
        console.log('Received message')
    })

    // device.on('data', (data) => {
    //     data = data.toObject();
    //     data.gps = {
    //         lon: 81.2795223,
    //         lat: 43.0095971
    //     }
    //     ws.send(JSON.stringify(data))
    // })

})