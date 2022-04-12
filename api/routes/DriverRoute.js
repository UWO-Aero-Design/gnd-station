const router = require('express').Router();
const data_interface = require('../services/data_interface/data_interface')

router.get('/current', (req, res) => { 
    const driver = data_interface.get_current_driver();
    res.status(200).json({ driver })
});

router.post('/current', (req, res) => { 
    if(!req.body.driver_name) {
        res.status(400).json({ error: 'NoDriverGiven', message: 'No driver was specified in "driver_name"' });
        return;
    }
    const new_driver = data_interface.select_current_driver(req.body.driver_name);
    if(new_driver == null) {
        res.status(406).json({ error: 'InvalidDriver', message: 'The specified driver in "driver_name" is invalid' });
        return;
    }
    res.status(200).json({ driver: new_driver })
});

router.get('/all', (req, res) => { 
    const drivers = data_interface.get_all_drivers();
    res.status(200).json({ drivers })
});




module.exports = router;
