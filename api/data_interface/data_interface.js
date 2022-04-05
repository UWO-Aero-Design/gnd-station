const USB_DRIVER = require('./usb_driver')

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
            // TODO: send to web socket module (to frontend)
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

module.exports = {
    select_driver,
    get_driver
}

init();