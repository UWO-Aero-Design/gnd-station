const router = require('express').Router();
const { Message } = require('../message/message_pb')
const usb = require('../config/usb')

let packet_number = 0;

router.post('/', (req, res) => { 
    let commands = req.body.commands;
    if(!commands) {
        return res.status(400).send('No command specified')
    }
    let message = new Message()
    message.setSender(Message.Location.GROUND_STATION)
    message.setRecipient(Message.Location.PLANE)
    message.setPacketNumber(packet_number++);
    message.setTime(Math.floor(new Date().getTime() / 1000));
    message.setStatus(Message.Status.READY);
    commands.forEach(command => {
        command = command.toUpperCase();
        if(command === 'OPEN_DOORS') {
            message.addCommands(Message.Command.OPEN_DOORS);
        }
        else if(command === 'CLOSE_DOORS') {
            message.addCommands(Message.Command.CLOSE_DOORS);
        }
        else if(command === 'DROP_PAYLOAD') {
            message.addCommands(Message.Command.DROP_PAYLOADS);
        }
        else if(command === 'DROP_GLIDERS') {
            message.addCommands(Message.Command.DROP_GLIDERS);
        }
        else {
            return res.status(406).send('Invalid command')
        }
    })
    const serialized_message = message.serializeBinary()
    let hex_string = '';
    for(var i = 0; i < serialized_message.length; i++) {
        hex_string = hex_string + serialized_message[i].toString(16) + " "
    }
    console.log(`Serialized message to ${serialized_message.length} bytes`)
    usb.write(serialized_message)
        .then(() => {
            return res.status(200).send('Packet sent')
        })
        .catch(error => {
            return res.status(500).json(error);
        })
});




module.exports = router;
