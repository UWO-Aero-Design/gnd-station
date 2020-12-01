const router = require('express').Router();


router.post('/', (req, res) => { 
    if(!req.body.command) {
        return res.status(400).send('No command specified')
    }
    const command = req.body.command.toUpperCase();
    if(command === 'OPEN_DOORS') {
        return res.status(200).send('Opened doors')
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
