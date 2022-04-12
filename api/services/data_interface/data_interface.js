const WebSocket = require('ws')
const events = require('events');

const wss = require('../websocket/ws')
const USB_DRIVER = require('./usb_driver')
const DUMMY_DRIVER = require('./dummy_driver')

const PRINT_TELEMETRY_MESSAGES = false;
const PRINT_DRIVER_MESSAGES = true;

const event = new events.EventEmitter();

/* the data interface has an event emitter with the following event channels
 *      - telemetry: for data to be sent to the frontend -> { data: { ... } }
 *      - command: for data to be sent to the aircraft -> { command: '', args: { ... } }
 *      - error: for any errors that occur -> { error: '', message: '' }
 */

/* all drivers should have the following:
 *  - a name string property to be used for driver selection
 *  - a init() function to perform any required startup routines
 *  - a process_command(command, args) function that will handle inbound commands from the frontend
 *  - a event emitter called event with the following event channels
 *      - telemetry: for data to be sent to the frontend -> { data: { ... } }
 *      - error: for any errors that occur -> { error: '', message: '' }
 */
const DEFAULT_DRIVER = DUMMY_DRIVER;
const drivers = [ USB_DRIVER, DUMMY_DRIVER ];
let current_driver;


const init = () => {
    current_driver = DEFAULT_DRIVER;

    drivers.forEach(driver => {
        // run the init function for each driver
        driver.init();

        // set up event handling on each driver
        // telemetry: { data: { ... } }
        driver.event.on('telemetry', (telemetry) => {
            const data = JSON.parse(telemetry).data
            if(PRINT_TELEMETRY_MESSAGES) {
                console.log(`Received telemetry from ${driver.name} (packet #: ${data.packetNumber})`)
            }

            // only run code for the selected driver
            if(driver.name === current_driver.name) {
                wss.get_websocket().clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        event.emit('telemetry', JSON.stringify({ data }))
                        client.send(JSON.stringify({ sender: 'BACKEND', recipient: 'FRONTEND', type: 'TELEMETRY', telemetry: data }))
                    }
                })
            }
        })

        // for each web socket connection...
        wss.get_websocket().on('connection', (ws) => {
            // when a message is received on that connection...
            ws.on('message', (message) => {
                message = JSON.parse(message);

                if(message.sender === 'FRONTEND' && message.type === 'COMMAND') {
                    const { command, args } = message
                if(driver.name === current_driver.name) {
                    event.emit('command', JSON.stringify({ command, args }))
                    current_driver.process_command(command, args)
                    }
                }
            })
        })

        // error: { error: '', message: '' }
        driver.event.on('error', (err) => {
            const { error, message } = JSON.parse(err)
            console.log(`Received error from ${driver.name}: ${error} - ${message}`)
            event.emit('error', JSON.stringify({ error, message }))
        })
    })
}

const get_driver = (driver_name) => {
    // to hold the return value
    let selected_driver = null;

    drivers.forEach(driver => {
        // check if the current driver is the desired driver
        if(driver.name.toLowerCase() === driver_name.toLowerCase()) {
            if(PRINT_DRIVER_MESSAGES) {
                console.log(`Selecting data driver ${driver.name}`)
            }
            selected_driver = driver;
        }
    })

    return selected_driver;
}

const get_current_driver = () => {
    return current_driver.name;
}

const select_current_driver = (driver_name) => {
    const desired_driver = get_driver(driver_name);
    if(!desired_driver == null) {
        current_driver = desired_driver;
    }
    return desired_driver.name;
}

const get_all_drivers = () => {
    let names = [];
    drivers.forEach(driver => {
        names.push(driver.name)
    })
    return names;
}

const process_command = (command, args) => {
    if(current_driver) {
        current_driver.process_command(command, args);
    }
}

module.exports = {
    get_all_drivers,
    select_current_driver,
    get_current_driver,
    process_command,
    init,
    event
}