const router = require('express').Router();
const data_interface = require('../services/data_interface/data_interface')
// const mavlink = require('node-mavlink');
// import { SerialPort } from 'serialport'
// import { MavLinkPacketSplitter, MavLinkPacketParser } from 'node-mavlink'

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


//Connecting ground station and PADA MavLink

// Create a UDP MAVLink connection to the vehicle

// substitute /dev/ttyACM0 with your serial port!
// const port = new SerialPort({ path: '/dev/ttyACM0', baudRate: 57600 })

//   connection.on('ready', function() {
//     console.log('Mavlink connection ready!');
//   });

// // constructing a reader that will emit each packet separately
// const reader = port
//   .pipe(new MavLinkPacketSplitter())
//   .pipe(new MavLinkPacketParser())

// reader.on('data', packet => {
//   console.log(packet)
// })
// // Send a command to the vehicle
// const stabilize_command = new mavlink.messages.command_long(
//   1,                  // target system ID
//   1,                  // target component ID
//   mavlink.MAV_CMD.DO_SET_MODE, // command ID
//   0,                  // confirmation
//   208,                  // MODE_STABILIZED_ARMED
//   0, 0, 0, 0, 0       // parameters (not used for this command)
// );

// // Send a command to the vehicle
// const autonomous_command = new mavlink.messages.command_long(
//     1,                  // target system ID
//     1,                  // target component ID
//     mavlink.MAV_CMD.DO_SET_MODE, // command ID
//     0,                  // confirmation
//     220,                  // MODE_AUTO_ARMED
//     0, 0, 0, 0, 0       // parameters (not used for this command)
//   );


  router.post('/mav/stabilize',(req,res) => {
    connection.sendMessage(stabilize_command)
  })

  router.post('/mav/autonomous',(req,res) => {
    connection.sendMessage(autonomous_command)
  })



module.exports = router;
