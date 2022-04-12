const WebSocket = require('ws')
const wss = require('../websocket/ws')
const USB_DRIVER = require('./usb_driver')
const DUMMY_DRIVER = require('./dummy_driver')

const PRINT_TELEMETRY_MESSAGES = false;
const PRINT_DRIVER_MESSAGES = true;

/* all drivers should have the following:
 *  - a name string property to be used for driver selection
 *  - a init() function to perform any required startup routines
 *  - a process_command(command, args) function that will handle inbound commands from the frontend
 *  - a event emitter called event with the following event channels
 *      - telemetry: for data to be sent to the frontend -> { data: { ... } }
 *      - command: for data to be sent to the aircraft -> { command: '', args: { ... } }
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
        // event: { data: { ... } }
        driver.event.on('telemetry', (event) => {
            const data = JSON.parse(event).data
            if(PRINT_TELEMETRY_MESSAGES) {
                console.log(`Received telemetry from ${driver.name} (packet #: ${data.packet_number})`)
            }

            // only run code for the selected driver
            if(driver.name === current_driver.name) {
                wss.get_websocket().clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(data))
                    }
                })
            }
        })

        // for each web socket connection...
        wss.get_websocket().on('connection', (ws) => {
            // when a message is received on that connection...
            ws.on('message', (event) => {
                const { command, args } = JSON.parse(event)
                if(driver.name === current_driver.name) {
                    current_driver.process_command(command, args)
                }
            })
        })

        // event: { error: '', message: '' }
        driver.event.on('error', (event) => {
            event = JSON.parse(event)
            console.log(`Received error from ${driver.name}: ${event.error} - ${event.message}`)
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
    init
}