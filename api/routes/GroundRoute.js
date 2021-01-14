const router = require('express').Router();

const SerialPort = require('serialport') 
const usb = require('../config/usb')

router.get('/com', async (req, res) => {
    let get_all = req.query.all;
    usb.list()
        .then(devices => {
            if(get_all != undefined) {
                return res.status(200).json(devices)
            }
            else {
                let filtered_devices = [];
                devices.forEach(device => {
                    if(device.manufacturer !== undefined) {
                        filtered_devices.push(device)
                    }
                })
                return res.status(200).json(filtered_devices)
            }
        })
        .catch(error => {
            return res.status(500).json(error)
        })
});

router.post('/com', async (req, res) => { 
    const com = req.body;
    if(!com.path) {
        return res.status(400).send('Invalid COM device')
    }
    else {
        usb.select(com.path)
            .then(() => {
                return res.status(200).send();
            })
            .catch(error => {
                console.log(error)
                return res.status(500).json(error);
            })
    }
});

router.post('/com/test', (req, res) => { 
    usb.write('hello')
        .then(() => {
            return res.status(200).send();
        })
        .catch(error => {
            return res.status(500).json(error);
        })
});



module.exports = router;
