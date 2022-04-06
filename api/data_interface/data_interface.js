const USB_DRIVER = require('./usb_driver')

/* all drivers should have the following:
 *  - a name string property to be used for driver selection
 *  - a init() function to perform any required startup routines
 *  - a process_command(command, args) function that will handle inbound commands from the frontend
 *  - a event emitter called event with the following event channels
 *      - telemetry: for data to be sent to the frontend
 *      - command: for data to be sent to the aircraft
 *      - error: for any errors that occur
 */
const drivers = [
    USB_DRIVER
]
let current_driver;
const DEFAULT_DRIVER = 'USB_DRIVER';

const init = () => {
    current_driver = select_driver('USB_DRIVER');

    drivers.forEach(driver => {
        driver.init();
        driver.event.on('telemetry', (data) => {
            console.log(`Received telemetry from ${driver.name}: ${data.message}`)
            if(driver.name === current_driver.name) {
                // TODO: send to web socket module (to frontend)
            }
        })

        driver.event.on('error', (data) => {
            console.log(`Received error from ${driver.name}: ${data.message}`)
        })
    })
}

const select_driver = (driver_name) => {
    driver_name = driver_name.toUpperCase()
    drivers.forEach(driver => {
        if(driver.name === driver_name) {
            console.log(`switching driver to ${driver.name}`)
            current_driver = driver;
        }
    })
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