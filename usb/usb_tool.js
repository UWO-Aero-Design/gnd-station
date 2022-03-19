const SerialPort = require('serialport') 
const InterByteTimeout = require('@serialport/parser-inter-byte-timeout')
const WebSocket = require('ws');
require('dotenv').config({ path: '../.env' })

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
                list_devices(ws);
                break;

            // message: { recipient: 'USB_TOOL, type: 'SELECT_DEVICE', device: { ... } }
            case 'SELECT_DEVICE':
                select_device(ws, message.device);
                break;
        }
    }
})

const list_devices = async(ws) => {
    const list = await SerialPort.SerialPort.list()

    const message = {
        recipient: 'BACKEND',
        type: 'LIST_DEVICES',
        devices: list
    }

    console.log(message)

    ws.send(JSON.stringify(message));
}

const select_device = async (ws, device) => {

    // close port if already open
    if(device != null) {
        await device.close()
    }

    device = new SerialPort(device.path);
    parser = device.pipe(new InterByteTimeout({ interval: 100} ))
    parser.on('data', handle_message)

    console.log(`Connected to ${device.path}`)

    device.on('close', () => {
        console.log(`Disconnected from ${device.path}`)
        device = null;
    })
}

const handle_message = (buffer) => {
    try {
        const decoded = Message.deserializeBinary(data);

        // send ack
        try {
            const ack = generate_ack(Message.Location.PLANE);
            const serialized_message = ack.serializeBinary();
            write(serialized_message);
        }
        catch(error) {
            console.log("Error sending ack")
        }
    } catch(error) {
        console.log('Error decoding');
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
