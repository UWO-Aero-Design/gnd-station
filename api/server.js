const path = require('path');
const fs = require('fs')

const express = require('express');
const morgan = require('morgan');
const WebSocket = require('ws');

const redoc = require('redoc-express');
const jsyaml = require('js-yaml');

// app configuration
const node_port = 5000;
const node_env = process.env.NODE_ENV || 'development';
const app = express();

// middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

// ejs registration
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')

// routes
app.get('/', (req, res) => res.send())
app.get('/docs/open_api', (req, res) => { 
    const docs = jsyaml.safeLoad(fs.readFileSync('./docs/open_api.yml', 'utf8'))
    res.send(docs)
});
app.get('/docs', redoc({ title: 'Backend Documentation', specUrl: '/docs/open_api' }) );
const ServoRoute = require('./routes/ServoRoute')

const server = app.listen(node_port, () => {
  console.log(`Server started on port ${node_port} in mode ${node_env}`);
});

const wss = new WebSocket.Server({ server: server });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        message = JSON.parse(message);
        message.type = message.type.toUpperCase()
        console.log('Received message')
        switch(message.type) {
            case "SERVO":
                ServoRoute.handle(message)
                break;
            case "RECORD":
                break;
            case "COM":
                break;
            case "RECORD":
                break;
            case "TELEMETRY":
                break;
            case "COMMAND":
                break;
            default:
                break;
        }
    })
})