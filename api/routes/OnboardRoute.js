const router = require('express').Router();

router.post('/servo', (req, res) => { 
    const servos = req.body.servos;
    console.log('Servos to be updated:')
    servos.forEach(servo => {
        if(!servo.name) {
            console.log('Error: Invalid servo formatting')
            return res.status(400).send('Error: Invalid servo formatting');
        }
        else if(!servo.open && !servo.close && !servo.bind) {
            console.log('Error: Nothing to update in servo')
            return res.status(400).send('Error: Nothing to update in servo');
        }
        else {
            console.log(servo)
        }
    })
    res.status(200).send();
});



module.exports = router;
