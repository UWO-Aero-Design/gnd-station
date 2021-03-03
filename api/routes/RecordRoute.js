const router = require('express').Router();
const Recording = require('../models/RecordingModel')

router.get('/', async (req, res) => { 
    const recordings = await Recording.find({}, '-commands -telemetry');
    res.status(200).json({
        recordings,
        length: recordings.length
    })
});

router.get('/status', async (req, res) => { 
    const status = await Recording.is_recording();
    res.status(200).json({ status })
});

router.post('/', async (req, res) => { 
    if(!req.body.action) {
        return res.status(400).send('No action specified')
    }
    const action = req.body.action.toLowerCase();
    if(action !== 'start' && action !== 'stop') {
        return res.status(400).send('Invalid action')
    }
    else if(action === 'stop') {
        if(Recording.is_recording()) {
            const _id = Recording.get_current_recording();
            Recording.clear_recording();
            console.log('Stopped recording')
            return res.status(200).send(`Stopped recordings (${_id})`)
        }
        else {
            return res.status(200).send(`Recording already stopped`)
        }
    }
    else {
        if(Recording.is_recording()) {
            return res.status(200).send(`Recording alreay in progress (${Recording.get_current_recording()})`)
        }
        else {
            const recording = await new Recording().save();
            Recording.set_recording(recording._id)
            console.log('Started recording')
            return res.status(200).send(`Started recording (${Recording.get_current_recording()})`)
        }
    }
});

router.get('/:record_id', async (req, res) => { 
    const recording = await Recording.findById(req.params.record_id)
    return res.status(200).json(recording)
});

router.get('/:record_id/recent', async (req, res) => { 
    const recording = await Recording.findById(req.params.record_id)
    if(recording === null) {
        return res.status(404).send();
    }
    let recent_result = {}
    if(recording.telemetry.length > 0) {
        recent_result.telemetry = recording.telemetry[recording.telemetry.length-1]
    }
    if(recording.commands.length > 0) {
        recent_result.command = recording.commands[recording.commands.length-1]
    }
    return res.status(200).json(recent_result)
});

router.post('/:record_id', async (req, res) => { 
    const recording = await Recording.findById(req.params.record_id)
    recording.add_timestep(req.body)
    return res.status(200).json({ id: req.params.record_id, date: "1583236800" })
});

router.delete('/:record_id', async (req, res) => { 
    const _id = req.params.record_id;
    if(Recording.get_current_recording() == _id) {
        Recording.clear_recording();
        console.log('Stopped recording')
    }
    const recording = await Recording.findByIdAndDelete(_id)
    return res.status(200).send()
});

router.delete('/', async (req, res) => { 
    if(Recording.is_recording()) {
        Recording.clear_recording();
        console.log('Stopped recording')
    }
    const recording = await Recording.deleteMany({})
    return res.status(200).send()
});



module.exports = router;
