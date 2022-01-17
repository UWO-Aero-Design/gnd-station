const events = require('events');

const SerialPort = require('serialport') 
const InterByteTimeout = require('@serialport/parser-inter-byte-timeout')
// const usb_detect = require('usb-detection');

const { Message } = require('../message/message_pb')

const DEBUG = false;
var current_port = null;
var parser = null;
const device = new events.EventEmitter();

const write = (data) => {
    return new Promise((resolve, reject) => {
        if(current_port == null) {
            console.log('\x1b[31mERROR: Current port has not yet been selected\x1b[0m')
            reject(new Error('Current port has not yet been selected'));
        }
        else {
            device.emit('sent', data);
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
    parser = current_port.pipe(new InterByteTimeout({ interval: 100} ))
    parser.on('data', (buf) => {
        buf = Buffer.from(buf)
        let data = buf.slice(0, buf.length-2)
        let rssi = buf.slice(buf.length-2).readInt16BE();
        try {
            const decoded = Message.deserializeBinary(data);
            decoded.setRssi(rssi)
            if(DEBUG) {
                console.log(`Message from ${get_location_name(decoded.getSender())}: Len: ${data.length}, RSSI: ${decoded.getRssi()}, Packet: ${decoded.getPacketNumber()} Time: ${decoded.getTime()} `)
            }
            device.emit('data', decoded)
            try {
                const ack = generate_ack(Message.Location.PLANE);
                const serialized_message = ack.serializeBinary();
                write(serialized_message);
            }
            catch(error) {
                console.log("Error sending ack")
            }
            
        }
        catch(error) {
            // console.log(error);
            console.log('Error reading from usb')
        }
    })
    current_port.on('close', (message) => {
        console.log(`Disconnected from ${current_port.path}`)
        current_port = null;
    })
    return current_port;
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
        else if (filtered_devices.length === 1) {
            select(filtered_devices[0].path)
            console.log(`Auto-connected to ${current_port.path}`)
        }
    }
}

auto_connect();

// usb_detect.startMonitoring();

// usb_detect.on('change', device => {
//     // leave a sec for the Teensy to boot and then connect
//     setTimeout(auto_connect,1000);
// });

module.exports = {
    current_port,
    parser,
    write,
    list,
    select,
    device
}

const get_location_name = (loc) => {
    if (loc === Message.Location.PLANE) return "PLANE";
    else if (loc === Message.Location.GROUND_STATION) return "GROUND";
    else if (loc === Message.Location.GLIDER0) return "GLIDER0";
    else if (loc === Message.Location.GLIDER0) return "GLIDER1";
    else if (loc === Message.Location.ANY) return "ANY";
    else return "UNKNOWN";
}

const generate_ack = (to) => {
    let message = new Message()
    message.setSender(Message.Location.GROUND_STATION)
    message.setRecipient(to)
    message.setPacketNumber(0);
    message.setTime(Math.floor(new Date().getTime() / 1000));
    message.setStatus(Message.Status.READY);
    return message;
}