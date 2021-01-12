const router = require('express').Router();

const SerialPort = require('serialport') 

var current_port = null;

router.get('/com', async (req, res) => {
    let get_all = req.query.all;
    SerialPort.list()
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
        if(current_port != null) {
            await current_port.close();
        }
        current_port = new SerialPort(com.path, (error) => {
            if(error) {
                console.log(error)
                return res.status(500).json(error);
            }
            else {
                return res.status(200).send();
            }
        });
    }
});

router.post('/com/test', (req, res) => { 
    current_port.write('Hello World', error => {
        if (error) {
            console.log(error)
            return res.status(500).json(error);
        }
        else {
            return res.status(200).send();
        }
    })
});



module.exports = router;
