const router = require('express').Router();
const { Message } = require('../message/message_pb')
const usb = require('../config/usb')

// temp
let packet_number = 0;

router.post('/', (req, res) => { 
    if(!req.body.command) {
        return res.status(400).send('No command specified')
    }
    const command = req.body.command.toUpperCase();
    let message = new Message()
    message.setSender(Message.Location.GROUND_STATION)
    message.setRecipient(Message.Location.PLANE)
    message.setPacketNumber(packet_number++);
    message.setTime(Math.floor(new Date().getTime() / 1000));
    message.setStatus(Message.Status.READY);
    if(command === 'OPEN_DOORS') {
        const serialized_message = message.serializeBinary()
        let hex_string = '';
        for(var i = 0; i < serialized_message.length; i++) {
            hex_string = hex_string + serialized_message[i].toString(16) + " "
        }
        usb.write(serialized_message)
            .then(() => {
                return res.status(200).send('Opened doors')
            })
            .catch(error => {
                return res.status(500).json(error);
            })
    }
    else if(command === 'CLOSE_DOORS') {
        return res.status(200).send('Closed doors')
    }
    else if(command === 'DROP_PAYLOAD') {
        return res.status(200).send('Dropped payload')
    }
    else if(command === 'DROP_GLIDERS') {
        return res.status(200).send('Dropped gliders')
    }
    else {
        return res.status(406).send('Invalid command')
    }
});




module.exports = router;
