const router = require('express').Router();
const WebSocket = require('ws')
const wss = require('../services/websocket/ws')
const alt_offset = require('../services/telemetry/alt_offset')

router.post('/com', async (req, res) => {
    wss.get_websocket().clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ sender: 'BACKEND', recipient: 'USB_TOOL', type: 'LIST_DEVICES' }))
        }
    })
    return res.status(200).send();
});

router.post('/com/current', async (req, res) => {
    wss.get_websocket().clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ sender: 'BACKEND', recipient: 'USB_TOOL', type: 'GET_DEVICE' }))
        }
    })
    return res.status(200);
});

router.post('/com/select', async (req, res) => { 
    let path = req.body.path;
    if(!path) {
        return res.status(400).send('No path specified')
    }

    wss.get_websocket().clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ sender: 'BACKEND', recipient: 'USB_TOOL', type: 'SELECT_DEVICE', path: path }))
        }
    })

    return res.status(200).send();
});

router.post('/offset/alt', async (req, res) => {
    let offset = req.body.offset;
    if(!offset) {
        return res.status(400).send('No offset specified')
    }
    
    alt_offset.set(offset)
    return res.status(200).send();
});

router.get('/offset/alt', async (req, res) => {
    return res.status(200).json({ alt_offset: alt_offset.get() });
});

router.get('/mapkey', (req, res) => {
    const key = process.env.MAPBOX_API_KEY;
    if(key) {
        return res.status(200).json({ key }); 
    }
    else {
        return res.status(404).send();
    }
})



module.exports = router;
