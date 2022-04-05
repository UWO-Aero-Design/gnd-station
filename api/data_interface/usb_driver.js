const events = require('events');

const name = 'USB_DRIVER'

const init = () => {
    // TODO: setup event from USB tool websocket
}

const event = new events.EventEmitter();

module.exports = {
    name,
    init,
    event
}