const router = require('express').Router();
const data_interface = require('../services/data_interface/data_interface')

const Recording = require('../models/RecordingModel')
const { Message } = require('../message/message_pb')
// const usb = require('../config/usb')

let packet_number = 0;

router.post('/', (req, res) => { 
    let commands = req.body.commands;
    if(!commands) {
        return res.status(400).send('No command specified')
    }

    commands.forEach(command_item => {
        if(!command_item.args) command_item.args = [];
        data_interface.process_command(command_item.command, command_item.args)
    })

    return res.status(200).send();
});




module.exports = router;
