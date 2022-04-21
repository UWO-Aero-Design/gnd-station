const { SerialPort } = require('serialport')
const usbDetect = require('usb-detection');
const { InterByteTimeoutParser } = require('@serialport/parser-inter-byte-timeout')
const WebSocket = require('ws');
require('dotenv').config({ path: '../.env' })

const PRINT_INCOMING_MESSAGES = true;
const PRINT_OUTBOUND_MESSAGE = false;
const PRINT_USB_CONNECTION_MESSAGES = true;
const PRINT_WS_CONNECTION_MESSAGES = true;
const GENERATE_MESSAGE_ACKS = false;
const SEND_HEARTBEAT_INTERVAL = 200;
const PARSER_TIMEOUT = 50;
const AUTO_CONNECT_DELAY = 500;
const AUTO_CONNECT_TIMEOUT = 100;
const BAUD_RATE = 115200

const PING_PACKET_HEADER = new Uint8Array([0xAA])
const TELEMETRY_PACKET_HEADER = new Uint8Array([0xBB])

const { Message } = require('./message/message_pb');
const { ReadyParser } = require('serialport');

const port = process.env.API_PORT || 5000;
const ws = new WebSocket(`ws://localhost:${port}`);

let device = null;
let parser = null;
let heartbeat_interval = null;
let packet_number = 0;

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
                ws.send(JSON.stringify({ sender: 'USB_TOOL', recipient: 'BACKEND', type: 'LIST_DEVICES', devices }));
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
                ws.send(JSON.stringify({ sender: 'USB_TOOL', recipient: 'BACKEND', type: 'ERROR', message: 'The command contains an invalid type' }));

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

usbDetect.on('add', (usb_port) => { 
    // usb-detection seems to discover devices before SerialPort has access to them
    // not the prettiest solution but adding a small delay resolves these issues on Mac
    // TODO: test to see if these issues occur on Windows and Linux
    if(device == null) setTimeout(auto_connect, AUTO_CONNECT_DELAY);
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

    device = new SerialPort({ path: device_to_connect.path, baudRate: BAUD_RATE });
    parser = device.pipe(new InterByteTimeoutParser({ interval: PARSER_TIMEOUT} ))
    parser.on('data', handle_message);
    device.on('close', handle_close);

    heartbeat_interval = setInterval(send_heartbeat, SEND_HEARTBEAT_INTERVAL);

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
    write_to_device(device, generate_telemetry_message(serialized_message))
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
    ws.send(JSON.stringify({ sender: 'USB_TOOL', recipient: 'BACKEND', type: 'TELEMETRY', telemetry }));
}

const handle_close = () => {
    console.log(`Disconnected from ${device.path}`)
    device = null;
    clearInterval(heartbeat_interval);
    usbDetect.startMonitoring();
}

const write_to_device = async(dev, data) => {
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
const load_header = (to) => {
    let message = new Message()
    message.setSender(Message.Location.GROUND_STATION)
    message.setRecipient(to)
    message.setPacketNumber(packet_number++);
    message.setTime(Math.floor(new Date().getTime() / 1000));
    message.setStatus(Message.Status.READY);
    return message;
}

const send_heartbeat = () => {
    if(!device) return;
    let message = load_header(Message.Location.PLANE)
    const serialized_message = message.serializeBinary();
    if(!write_to_device(device, generate_telemetry_message(serialized_message))) {
        console.log('Error sending heartbeat')
    }
}

// generate a command message
const generate_command = (to, command, args) => {
    let message = load_header(Message.Location.PLANE)

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

const merge_arrays = (arr1, arr2) => {
    const buf = new Uint8Array(arr1.length + arr2.length);
    buf.set(arr1);
    buf.set(arr2, arr1.length);
    return buf;
}

const generate_telemetry_message = (data) => {
    const arr = merge_arrays(TELEMETRY_PACKET_HEADER, data);
    return arr;
}

const generate_ping_message = (data) => {
    if(data == undefined) return PING_PACKET_HEADER;
    return merge_arrays(PING_PACKET_HEADER, data);
}

const auto_connect = async () => {
    const devices = await get_device_list();

    // for each device, attempt to send the ping packet
    // if a response is received, that must be the correct device
    // if a response isn't received, close the port and give up
    devices.forEach(async device => {
        // connect to device and send message
        let port_to_try = new SerialPort({ path: device.path, baudRate: BAUD_RATE });
        port_to_try.write(generate_ping_message());
        
        // silently fail since some devices will throw errors if you try to connect to them
        // could technically be thrown when connecting to the ground station but this is
        // a "quality of life" feature and there's no other way to effectively detect
        // that a specfic device is the ground station
        port_to_try.on('error', (err) => {
            // do nothing - probably a device we can't connect to
        })
        
        port_to_try.on('data', async (msg) => {
            // save the path since we'll now disconnect
            let path_to_connect = port_to_try.settings.path;
            if(port_to_try.isOpen) await port_to_try.close()

            // if the response is the correct one, connect to the serial port
            if(msg[0] == PING_PACKET_HEADER) {
                console.log(`Detected ${port_to_try.settings.path} as ground station`)
                select_device({ path: path_to_connect });
            }
        })
        
        // close the serial port after no response has been received
        setTimeout(async () => {
            if(port_to_try.isOpen) await port_to_try.close()
        }, AUTO_CONNECT_TIMEOUT)
    })
}

const startup = () => {
    usbDetect.startMonitoring();
    auto_connect()
}
startup();
