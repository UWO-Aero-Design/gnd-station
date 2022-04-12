const events = require('events');

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
        })
    })
}

const process_command = (command, args) => {
    console.log(`Sending command ${command} with args ${args}`)
}

module.exports = {
    name,
    init,
    event,
    process_command
}