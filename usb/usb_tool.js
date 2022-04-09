const { SerialPort } = require('serialport')
const { usbDetect } = require('usb-detection');
const { InterByteTimeoutParser } = require('@serialport/parser-inter-byte-timeout')
const WebSocket = require('ws');
require('dotenv').config({ path: '../.env' })

const PRINT_INCOMING_MESSAGES = true;
const PRINT_OUTBOUND_MESSAGE = true;
const PRINT_USB_CONNECTION_MESSAGES = true;
const PRINT_WS_CONNECTION_MESSAGES = true;
const GENERATE_MESSAGE_ACKS = false;
const PARSER_TIMEOUT = 300;

const { Message } = require('./message/message_pb');
const { ReadyParser } = require('serialport');

const port = process.env.API_PORT || 5000;
const ws = new WebSocket(`ws://localhost:${port}`);

let device = null;
let parser = null;

const on_ws_open = (ws) => {
    if(PRINT_WS_CONNECTION_MESSAGES) {
        console.log(`Connected to backend through port ${port}`)
    }
}

const on_ws_message = (message) => {
    message = JSON.parse(message);
    if(message.recipient == 'USB_TOOL') {
        switch(message.type) {
            // message: { recipient: 'USB_TOOL', type: 'LIST_DEVICES' }
            case 'LIST_DEVICES':
                const devices = get_device_list();
                ws.send(JSON.stringify({ recipient: 'BACKEND', type: 'LIST_DEVICES', devices }));
                break;

            // message: { recipient: 'USB_TOOL, type: 'SELECT_DEVICE', device: { ... } }
            case 'SELECT_DEVICE':
                select_device(message.device);
                break;

            // message: { recipient: 'USB_TOOL, type: 'COMMAND', command: '...', arguments: { ... } }
            case 'COMMAND':
                handle_command(message.command, message.arguments);
                break;

            // invalid message.type (let the backend know it messed up)
            default:
                ws.send(JSON.stringify({error: "The command contains an invalid type"}));

        }
    }
}

const ws_on_close = (code) => {
    console.log(`CLOSED: ${code}`)
    usbDetect.stopMonitoring()
}

const ws_connect = () => {
    ws.on('open', on_ws_open)
    ws.on('message', on_ws_message)
    ws.on('close', ws_on_close)
}
ws_connect()

usbDetect.on('add', function(usb_port) { 
    const devices = await get_device_list();
    let potential_devices = []

    if ((usb_port.manufacturer.toLowerCase().includes('arduino')) || 
            usb_port.manufacturer.toLowerCase().includes('teensyduino')) {
        devices.forEach(device => {
            // check to see if the device has a manufacturer property
            if(device.manufacturer) {
                if(device.manufacturer.toLowerCase().includes('arduino')) potential_devices.push(device)
                if(device.manufacturer.toLowerCase().includes('teensyduino')) potential_devices.push(device)
            }
        })
        // if there was a single potential match
        if(potential_devices.length == 1) {
            const path = potential_devices[0].path 
            console.log(`Auto connected to ${path}`)
            select_device({ path })
        } else {
            usbDetect.startMonitoring();
        }
        usbDetect.startMonitoring();
    }
});

const get_device_list = async() => {
    const list = await SerialPort.list()
    return list;
}

const select_device = async (device_to_connect) => {

    // close port if already open
    if(device != null) {
        await device.close()
    }

    device = new SerialPort({ path: device_to_connect.path, baudRate: 115200 });
    parser = device.pipe(new InterByteTimeoutParser({ interval: PARSER_TIMEOUT} ))
    parser.on('data', handle_message);
    device.on('close', handle_close);

    if(PRINT_USB_CONNECTION_MESSAGES) {
        console.log(`Connected to ${device.path}`)
    }

    usbDetect.stopMonitoring()  // No longer need to look for usb connections
}

// From the backend for the plane
const handle_command = (command, args) => {
    if(PRINT_OUTBOUND_MESSAGE) {
        console.log(`Running command: ${command}`)
    }

    try {
        var message = generate_command(Message.Location.PLANE, command)
    } catch(error) {
        console.log(error);
    }

    if(message == null) {
        console.log('Error generating command!');
        return;
    }
    const serialized_message = message.serializeBinary();
    write_to_device(device, serialized_message)
}

// Stuff from the plane to the gnd station
const handle_message = (buffer) => {
    let decoded;
    try {
        decoded = Message.deserializeBinary(buffer);
    } catch(error) {
        console.log('Error decoding: ' + error);
        return;
    }
    if(PRINT_INCOMING_MESSAGES) {
        console.log(`Message from ${get_location_name(decoded.getSender())}: Len: ${buffer.length}, RSSI: ${decoded.getRssi()}, Packet: ${decoded.getPacketNumber()} Time: ${decoded.getTime()} `)
    }

    let telemetry = decoded.toObject();
    ws.send(JSON.stringify(telemetry));

    if(GENERATE_MESSAGE_ACKS) {
        // send ack
        try {
            const ack = generate_ack(Message.Location.PLANE);
            const serialized_message = ack.serializeBinary();
            write_to_device(device, serialized_message);
        }
        catch(error) {
            console.log("Error sending ack")
            console.log(error)
        }
    }
}

const handle_close = () => {
    console.log(`Disconnected from ${device.path}`)
    device = null;
    usbDetect.startMonitoring();
}

const write_to_device = async(dev, data) => {
    // TODO: keep getting decode errors (receive) when sending a message
    if(dev == null) {
        console.log('Error writing: no device selected');
        return;
    }

    try {
        dev.write(data);
        if(PRINT_OUTBOUND_MESSAGE) {
            console.log('Message sent')
        }
        return data;
    }
    catch(e) {
        return null;
    }
}

// generate an ack message
const generate_ack = (to) => {
    let message = new Message()
    message.setSender(Message.Location.GROUND_STATION)
    message.setRecipient(to)
    message.setPacketNumber(0);
    message.setTime(Math.floor(new Date().getTime() / 1000));
    message.setStatus(Message.Status.READY);
    return message;
}

// generate a command message
const generate_command = (to, command, args) => {
    let message = new Message()
    message.setSender(Message.Location.GROUND_STATION)
    message.setRecipient(to)
    message.setPacketNumber(0);
    message.setTime(Math.floor(new Date().getTime() / 1000));
    message.setStatus(Message.Status.READY);

    switch(command) {
        case 'DROP_PADA':
            // TODO: change to DROP_PADA
            message.setCommandsList([ Message.Command.DROP_GLIDERS ]);
            break;

        case 'SERVO_CONFIG':
            if(!args) {
                throw "Error: no args given for servo config";
            }
            message.setServosList(args)
            break;

        default:
            throw `Error: The command ${command} is unsupported`;
    }

    return message;
}

const get_location_name = (loc) => {
    if (loc === Message.Location.PLANE) return "PLANE";
    else if (loc === Message.Location.GROUND_STATION) return "GROUND";
    else if (loc === Message.Location.GLIDER0) return "GLIDER0";
    else if (loc === Message.Location.GLIDER0) return "GLIDER1";
    else if (loc === Message.Location.ANY) return "ANY";
    else return "UNKNOWN";
}

const startup = async () => {
    const devices = await get_device_list();
    let potential_devices = []

    devices.forEach(device => {
        // check to see if the device has a manufacturer property
        if(device.manufacturer) {
            if(device.manufacturer.toLowerCase().includes('arduino')) potential_devices.push(device)
            if(device.manufacturer.toLowerCase().includes('teensyduino')) potential_devices.push(device)
        }
    })

    // if there was a single potential match
    if(potential_devices.length == 1) {
        const path = potential_devices[0].path 
        console.log(`Auto connected to ${path}`)
        select_device({ path })
    } else {
        usbDetect.startMonitoring();
    }
}
startup();
