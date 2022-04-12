const USB_DRIVER = require('./usb_driver')
const DUMMY_DRIVER = require('./dummy_driver')

const PRINT_TELEMETRY_MESSAGES = true;
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
                // TODO: send to web socket module (to frontend)
            }
        })

        // event: { error: '', message: '' }
        driver.event.on('error', (event) => {
            event = JSON.parse(event)
            console.log(`Received error from ${driver.name}: ${event.error} - ${event.message}`)
        })
    })
}

const select_driver = (driver_name) => {
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

const get_driver = () => {
    return current_driver.name;
}

const process_command = (command, args) => {
    if(current_driver) {
        current_driver.process_command(command, args);
    }
}

module.exports = {
    select_driver,
    get_driver,
    process_command
}

init();