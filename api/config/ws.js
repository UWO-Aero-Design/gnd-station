const WebSocket = require('ws');
const { device } = require('./usb');
const { Message } = require('../message/message_pb')

const wss = new WebSocket.Server({ port: 5001 });

wss.on('connection', (ws) => {
    console.log('Connected to frontend')
    ws.on('message', (message) => {
        message = JSON.parse(message);
        message.type = message.type.toUpperCase()
        console.log('Received message')
    })

    device.on('data', (data) => {
        data = data.toObject();
        ws.send(JSON.stringify(data))
    })

})