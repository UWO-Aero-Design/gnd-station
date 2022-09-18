const events = require('events');

const WebSocket = require('ws');
const wss = require('../websocket/ws')

const name = 'USB_DRIVER'

const event = new events.EventEmitter();


const init = () => {
    // for each web socket connection...
    wss.get_websocket().on('connection', (ws) => {
        // when a message is received on that connection...
        ws.on('message', (message) => {
            message = JSON.parse(message);

            if(message.sender === 'USB_TOOL' && message.type === 'TELEMETRY') {
                const { telemetry } = message
                event.emit('telemetry', JSON.stringify({ data: telemetry }))
            }

            if(message.sender === 'USB_TOOL' && message.type === 'DEVICE_LIST') {
                const { devices } = message
                wss.get_websocket().clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ sender: 'BACKEND', recipient: 'FRONTEND', type: 'DEVICE_LIST', devices }));
                    }
                });
            }

            if(message.sender === 'USB_TOOL' && message.type === 'CURRENT_DEVICE') {
                const { path } = message
                wss.get_websocket().clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ sender: 'BACKEND', recipient: 'FRONTEND', type: 'CURRENT_DEVICE', path }));
                    }
                });
            }
        })
    })
}

const process_command = (command, args) => {
    console.log(`Sending command ${command} with args ${args}`)
    wss.get_websocket().clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ sender: 'BACKEND', recipient: 'USB_TOOL', type: 'COMMAND', command: command, arguments: args }));
        }
    });
}

module.exports = {
    name,
    init,
    event,
    process_command
}