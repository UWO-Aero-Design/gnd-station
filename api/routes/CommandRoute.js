const router = require('express').Router();

const Recording = require('../models/RecordingModel')
const { Message } = require('../message/message_pb')
const usb = require('../config/usb')

let packet_number = 0;

router.post('/', (req, res) => { 
    let commands = req.body.commands;
    if(!commands) {
        return res.status(400).send('No command specified')
    }
    // build the message and include meta data
    let message = new Message()
    message.setSender(Message.Location.GROUND_STATION)
    message.setRecipient(Message.Location.PLANE)
    message.setPacketNumber(packet_number++);
    message.setTime(Math.floor(new Date().getTime() / 1000));
    message.setStatus(Message.Status.READY);

    // check if each command exists and add it
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

    // add to database (if necessary)
    if(Recording.is_recording()) {
        Recording.findById(Recording.get_current_recording())
            .then(recording => {
                recording.commands.push(message.toObject());
                recording.save()
                    .then(() => {
                        console.log('Saved command')
                    })
                    .catch(error => {
                        console.log('Unable to save command');
                        console.log(error);
                    });
            })
            .catch(error => {
                console.log('Unable to find recording');
                console.log(error);
            })
    }

    // serialize
    const serialized_message = message.serializeBinary()
    console.log(`Serialized message to ${serialized_message.length} bytes`)

    // send
    usb.write(serialized_message)
        .then(() => {
            return res.status(200).send('Packet sent')
        })
        .catch(error => {
            return res.status(500).json(error);
        })
});




module.exports = router;
