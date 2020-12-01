const router = require('express').Router();

const usb_detect = require('usb-detection');
usb_detect.startMonitoring();

var current_port = null;


router.get('/com', (req, res) => { 
    usb_detect.find((err, devices) => {
        if(err) {
            return res.status(500).json(err)
        }
        else {
            return res.status(200).json(devices)
        }
    });
});

router.post('/com', (req, res) => { 
    const com = req.body;
    if(!com.locationId || !com.vendorId || !com.productId || !com.deviceName || !com.manufacturer || !com.serialNumber || !com.deviceAddress) {
        return res.status(400).send("Invalid COM device")
    }
    else {
        current_port = com;
    }
});



module.exports = router;
