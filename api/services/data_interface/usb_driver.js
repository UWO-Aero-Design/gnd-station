const events = require('events');

const name = 'USB_DRIVER'

const init = () => {
    // TODO: setup event from USB tool websocket
}

const event = new events.EventEmitter();

const process_command = (command, args) => {
    console.log(`Sending command ${command} with args ${args}`)
}

module.exports = {
    name,
    init,
    event,
    process_command
}