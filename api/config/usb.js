const SerialPort = require('serialport') 
const Readline = require('@serialport/parser-readline')

const { Message } = require('../message/message_pb')

var current_port = null;
var parser = null;

const write = (data) => {
    return new Promise((resolve, reject) => {
        if(current_port == null) {
            console.log('\x1b[31mERROR: Current port has not yet been selected\x1b[0m')
            reject(new Error('Current port has not yet been selected'));
        }
        else {
            resolve(current_port.write(data));
        }
    })
}

const list = () => {
    return SerialPort.list()
}

const select = async (path) => {
    if(current_port != null) {
        await current_port.close();
    }
    current_port = new SerialPort(path);
    parser = current_port.pipe(new Readline())
    current_port.on('data', write_message)
    return current_port;
}

const write_message = (message) => {
    message = message.subarray(0, message.length-1)
    const decoded = Message.deserializeBinary(message);
    console.log(`Message received from ${get_location_name(decoded.getSender())} (${decoded.getPacketNumber()})`)
}

const get_location_name = (loc) => {
    if (loc === Message.Location.PLANE) return "PLANE";
    else if (loc === Message.Location.GROUND_STATION) return "GROUND";
    else if (loc === Message.Location.GLIDER0) return "GLIDER0";
    else if (loc === Message.Location.GLIDER0) return "GLIDER1";
    else if (loc === Message.Location.ANY) return "ANY";
    else return "UNKNOWN";
}

const auto_connect = async () => {
    if(current_port == null) {
        const devices = await SerialPort.list();
        let filtered_devices = [];
        devices.forEach(device => {
            if(device.manufacturer && device.manufacturer.toLowerCase() === 'teensyduino') {
                filtered_devices.push(device)
            }
        })
        if(filtered_devices.length > 1) {
            console.log(`Attempted to auto-connect but could not because ${filtered_devices.length} devices are connected`)
        }
        else {
            select(filtered_devices[0].path)
            console.log(`Auto-connected to ${current_port.path}`)
        }
        setTimeout(auto_connect, 3000)
    }
}

auto_connect();

module.exports = {
    current_port,
    parser,
    write,
    list,
    select
}