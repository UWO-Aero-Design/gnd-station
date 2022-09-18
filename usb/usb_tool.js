const { SerialPort } = require('serialport')
const usbDetect = require('usb-detection');
const { findByIds } = require('usb');
const { InterByteTimeoutParser } = require('@serialport/parser-inter-byte-timeout')
const WebSocket = require('ws');
require('dotenv').config({ path: '../.env' })

const PRINT_INCOMING_MESSAGES = true;
const PRINT_OUTBOUND_MESSAGE = false;
const PRINT_OUTBOUND_COMMAND = false;
const PRINT_COMMAND_ADDITIONS = true;
const PRINT_COMMAND_REMOVALS = true;
const PRINT_COMMAND_SUCCESS = true;
const PRINT_USB_CONNECTION_MESSAGES = true;
const PRINT_WS_CONNECTION_MESSAGES = true;
const SEND_HEARTBEAT_INTERVAL = 250;
const PARSER_TIMEOUT = 50;
const AUTO_CONNECT_DELAY = 500;
const AUTO_CONNECT_TIMEOUT = 100;
const BAUD_RATE = 115200
const COMMAD_RETRY_COUNT = 3;

const PING_PACKET_HEADER = new Uint8Array([0xAA])
const TELEMETRY_PACKET_HEADER = new Uint8Array([0xBB])

const { Telemetry } = require('./message/telemetry_pb');
const { Command, ActuateGroup, FlightStabilization, ActuateServo,
        ServoConfig, ServoGroup, ServoState, FlightStabilizationMethods } = require('./message/command_pb');
const { Header, Location, Status } = require('./message/header_pb');
const { ReadyParser } = require('serialport');


const port = process.env.API_PORT || 5000;
let ws;

let device = null;
let parser = null;
let heartbeat_interval = null;
let packet_number = 0;
let command_queue = [];
let ws_reconnect_interval;

const ws_send = (data) => {
    if(ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
    }
}

const ws_on_open = () => {
    if(PRINT_WS_CONNECTION_MESSAGES) {
        console.log(`Connected to backend through port ${port}`)
    }
    clearInterval(ws_reconnect_interval)
}

const ws_on_message = async (message) => {
    message = JSON.parse(message);
    if(message.recipient == 'USB_TOOL') {
        switch(message.type) {
            // message: { recipient: 'USB_TOOL', type: 'LIST_DEVICES' }
            case 'LIST_DEVICES':
                const devices = await get_device_list();
                ws_send({ sender: 'USB_TOOL', recipient: 'BACKEND', type: 'DEVICE_LIST', devices });
                break;

            // message: { recipient: 'USB_TOOL, type: 'GET_DEVICE' }
            case 'GET_DEVICE':
                ws_send({ sender: 'USB_TOOL', recipient: 'BACKEND', type: 'CURRENT_DEVICE', path: device?.path });
                break;

            // message: { recipient: 'USB_TOOL, type: 'SELECT_DEVICE', path: '...' }
            case 'SELECT_DEVICE':
                select_device({ path: message.path });
                break;

            // message: { recipient: 'USB_TOOL, type: 'COMMAND', command: '...', arguments: { ... } }
            case 'COMMAND':
                handle_command(message.command, message.arguments);
                break;

            // invalid message.type (let the backend know it messed up)
            default:
                ws_send({ sender: 'USB_TOOL', recipient: 'BACKEND', type: 'ERROR', message: 'The command contains an invalid type' });

        }
    }
}

const ws_on_close = (code) => {
    ws_reconnect_interval = setTimeout(ws_connect, 1000)
}

const ws_on_error = (error) => {
    if(error.code !== 'ECONNREFUSED' && error.code !== 'ECONNRESET') {
        console.log(error)
    }
}

const ws_connect = () => {
    ws = new WebSocket(`ws://localhost:${port}`);
    ws.on('open', ws_on_open)
    ws.on('message', ws_on_message)
    ws.on('close', ws_on_close)
    ws.on('error', ws_on_error)
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
    usbDetect.stopMonitoring();

    if(PRINT_USB_CONNECTION_MESSAGES) {
        console.log(`Connected to ${device.path}`)
    }

}

// From the backend for the plane
const handle_command = (command_name, args) => {
    if(PRINT_OUTBOUND_COMMAND) {
        console.log(`Running command: ${command_name} with args ${JSON.stringify(args)}`)
    }

    try {
        let command = generate_command(command_name, args)
        command_queue.push({ attempts: 0, packet_numbers: [], type: command_name, command });
    } catch(error) {
        console.log(error);
    }
}

// Stuff from the plane to the gnd station
const handle_message = (buffer) => {
    let decoded_telemetry;

    try {
        decoded_telemetry = Telemetry.deserializeBinary(buffer);
    } catch(error) {
        console.log('Error decoding: ' + error);
        return;
    }

    let telemetry = decoded_telemetry.toObject();

    if(telemetry.responseTo != 0) {
        command_queue = command_queue.filter(command => {
            if(command.packet_numbers.includes(telemetry.responseTo)) {
                if(PRINT_COMMAND_SUCCESS) {
                    console.log(`Success for command ${command.type} after ${command.attempts} attempt(s)`)
                }
                return false;
            }
            else {
                return true;
            }
        })
    }

    if(PRINT_INCOMING_MESSAGES) {
        console.log(`Message from ${get_location_name(telemetry.header.sender)}, Len: ${buffer.length}, Packet: ${telemetry.header.packetNumber}, Time: ${telemetry.header.time} `)
    }

    ws_send({ sender: 'USB_TOOL', recipient: 'BACKEND', type: 'TELEMETRY', telemetry });
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
const set_header = (command, to) => {
    let header = new Header()
    header.setSender(Location.GROUND_STATION)
    header.setReceiver(to)
    header.setPacketNumber(packet_number++);
    header.setTime(Math.floor(new Date().getTime() / 1000));
    header.setStatus(Status.READY);
    command.setHeader(header)
    return command;
}

const send_heartbeat = () => {
    if(!device) return;
    let message = set_header(new Command(), Location.PLANE)

    // check if we have commands to send
    // update queue to remove old commands
    command_queue = command_queue.filter(item => {
        item.attempts++;
        if(item.attempts <= COMMAD_RETRY_COUNT) {
            if(PRINT_COMMAND_ADDITIONS) {
                console.log(`Adding ${item.type} to message (attempt #: ${item.attempts})`)
            }

            // add the command to the message
            message = add_command_to_message(message, item.type, item.command);
            item.packet_numbers.push(message.getHeader().getPacketNumber());

            if(item.type === 'RESET_PROCESSOR') {
                return false;
            }

            return true;
        }
        else {
            if(PRINT_COMMAND_REMOVALS) {
                console.log(`\x1b[33mRemoving command ${item.type} after ${COMMAD_RETRY_COUNT} attempts.\x1b[0m`);
            }
            return false
        }
    })

    const serialized_message = message.serializeBinary();
    if(!write_to_device(device, generate_telemetry_message(serialized_message))) {
        console.log('Error sending heartbeat')
    }
}

// generate a command message
const generate_command = (command_name, args) => {
    let command;
    switch(command_name) {
        case 'ACTUATE_GROUP':
            command = generate_actuate_group(args)
            break;
        case 'ACTUATE_SERVO':
            command = generate_actuate_servo(args);
            break;
        case 'RESET_PROCESSOR':
            command = generate_processor_reset(args);
            break;
        case 'FLIGHT_STABILICARION':
        case 'SERVO_CONFIG':
        default:
            throw `Error: The command ${command_name} is unsupported`;
    }

    return command;
}

const generate_actuate_group = (args) => {
    if(args.state.toUpperCase() === 'OPEN') args.state = ServoState.OPEN
    else if(args.state.toUpperCase() === 'CLOSE') args.state = ServoState.CLOSE
    else throw `Error: The argument ${args.state} is not valid`;
    if(args.group.toUpperCase() === 'DROP_PADA') args.group = ServoGroup.DROP_PADA;
    else throw `Error: The argument ${args.group} is not valid`;
    let command = new ActuateGroup();
    command.setGroup(args.group);
    command.setState(args.state);
    return command;
}

const generate_actuate_servo = (args) => {
    let command = new ActuateServo();
    command.setServoNumber(args.servo_number);
    if(args.value) command.setValue(args.value);
    else {
        if(args.state.toUpperCase() === 'OPEN') command.setServoState(ServoState.OPEN)
        else if(args.state.toUpperCase() === 'CLOSE') command.setServoState(ServoState.CLOSE)
        else throw `Error: The argument ${args.state} is not valid`;
    }
    return command;
}

const generate_processor_reset = (args) => {
    return true;
}

const add_command_to_message = (message, type, command) => {
    switch(type) {
        case 'ACTUATE_GROUP':
            message.addActuateGroup(command);
            break;
        case 'ACTUATE_SERVO':
            message.addActuateServo(command);
            break;
        case 'RESET_PROCESSOR':
            message.setResetProcessor(true);
            break;
        case 'SERVO_CONFIG':
        case 'FLIGHT_STABILIZARION':
        default:
            throw `Error: The command ${type} is unsupported`;
    }

    return message;
}

const get_location_name = (loc) => {
    if (loc === Location.PLANE) return "PLANE";
    else if (loc === Location.GROUND_STATION) return "GROUND";
    else if (loc === Location.ANY) return "ANY";
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
    // select_device({ path: '/dev/tty.usbmodem62634901' })
    // return

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
                setTimeout(() => {
                    select_device({ path: path_to_connect });
                }, AUTO_CONNECT_DELAY)
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
