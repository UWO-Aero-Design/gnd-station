const events = require('events');
const mongoose = require('mongoose');


const name = 'DB_DRIVER'
let selected_record = null;
let current_index = null;

const event = new events.EventEmitter();

// event.emit('telemetry', JSON.stringify({ data }))

const init = () => {
    
}

const process_command = (command, args) => {
    console.log(`[DB Driver] Error: commands will not be processed by this driver`)
}

module.exports = {
    name,
    init,
    event,
    process_command
}