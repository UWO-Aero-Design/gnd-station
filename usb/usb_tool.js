const { SerialPort } = require('serialport') 
const { InterByteTimeoutParser } = require('@serialport/parser-inter-byte-timeout')
const WebSocket = require('ws');
require('dotenv').config({ path: '../.env' })

const PARSER_TIMEOUT = 300;

const { Message } = require('./message/message_pb');
const { ReadyParser } = require('serialport');

const port = process.env.WS_PORT || 5001;
const ws = new WebSocket(`ws://localhost:${port}`);

let device = null;
let parser = null;

ws.on('open', (ws) => {
    console.log('Connected to backend')
})

// when a command is received from the backend
ws.on('message', (message) => {
    message = JSON.parse(message);
    if(message.recipient == 'USB_TOOL') {
        switch(message.type) {
            // message: { recipient: 'USB_TOOL', type: 'LIST_DEVICES' }
            case 'LIST_DEVICES':
                const message = get_device_list();
                ws.send(JSON.stringify(message));
                break;

            // message: { recipient: 'USB_TOOL, type: 'SELECT_DEVICE', device: { ... } }
            case 'SELECT_DEVICE':
                select_device(message.device);
                break;

            // message: { recipient: 'USB_TOOL, type: 'COMMAND', command: '...', arguments: { ... } }
            case 'COMMAND':
                handle_command(message.command, message.arguments);
                break;
        }
    }
})

const get_device_list = async() => {
    const list = await SerialPort.list()

    const message = {
        recipient: 'BACKEND',
        type: 'LIST_DEVICES',
        devices: list
    }

    return message;
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

    console.log(`Connected to ${device.path}`)
}

const handle_command = (command, args) => {
    console.log(`Running command: ${command}`)
    const message = generate_command(Message.Location.PLANE, command)
    if(message == null) {
        console.log('Error generating command!');
        return;
    }
    const serialized_message = message.serializeBinary();
    write_to_device(device, serialized_message)
}

const handle_message = (buffer) => {
    let decoded;
    try {
        decoded = Message.deserializeBinary(buffer);
    } catch(error) {
        console.log('Error decoding: ' + error);
        return;
    }
    console.log(`Message from ${get_location_name(decoded.getSender())}: Len: ${buffer.length}, RSSI: ${decoded.getRssi()}, Packet: ${decoded.getPacketNumber()} Time: ${decoded.getTime()} `)

    let telemetry = decoded.toObject();
    ws.send(JSON.stringify(telemetry));

    // send ack
    // try {
    //     const ack = generate_ack(Message.Location.PLANE);
    //     const serialized_message = ack.serializeBinary();
    //     write_to_device(device, serialized_message);
    // }
    // catch(error) {
    //     console.log("Error sending ack")
    //     console.log(error)
    // }
}

const handle_close = () => {
    console.log(`Disconnected from ${device.path}`)
    device = null;
}

const write_to_device = async(dev, data) => {
    // TODO: keep getting decode errors (receive) when sending a message
    if(dev == null) {
        console.log('Error writing: no device selected');
        return;
    }

    try {
        dev.write(data);
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
                console.log('Error: no args given for servo config')
                return null;
            }
            message.setServosList(args)
            break;
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
    select_device({ path: '/dev/tty.usbmodem1432201' })
}
startup();
