const events = require('events');

const name = 'DUMMY_DRIVER'

const init = () => {
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