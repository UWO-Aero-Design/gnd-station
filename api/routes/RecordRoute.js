const router = require('express').Router();

var recording_status = "stop";

router.get('/', (req, res) => { 
    res.status(200).json({
        current_status: recording_status,
        total_recordings: 2,
        offset: 0,
        recordings: [
            { id: "5fc6a6bb6aa11d5c0e885c7e", date: "1583236800" },
            { id: "5fc6a6c9b4ab447eb5fb3c73", date: "1583292120" },
        ]
    })
});

router.post('/', (req, res) => { 
    if(!req.body.action) {
        return res.status(400).send('No action specified')
    }
    const action = req.body.action.toLowerCase();
    if(action !== 'start' && action !== 'stop') {
        return res.status(400).send('Invalid action')
    }
    else if(action === recording_status) {
        return res.status(200).send(`Recording alreay in status: ${recording_status}`)
    }
    else {
        recording_status = action;
        return res.status(200).send(`Recording updated to status: ${recording_status}`)
    }
});

router.get('/:record_id', (req, res) => { 
    return res.status(200).json({ id: req.params.record_id, date: "1583236800" })
});

router.delete('/:record_id', (req, res) => { 
    return res.status(200).send()
});



module.exports = router;
