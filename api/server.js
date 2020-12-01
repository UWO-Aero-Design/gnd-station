const path = require('path');

const express = require('express');
const morgan = require('morgan');
const WebSocket = require('ws');

// app configuration
const node_port = 5000;
const node_env = process.env.NODE_ENV || 'development';
const app = express();

// middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

// ejs registration
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')

// routes
app.use('/docs', require('./routes/DocRoute'))
app.use('/onboardconfig', require('./routes/OnboardRoute'))
app.use('/record', require('./routes/RecordRoute'))
app.use('/ground', require('./routes/GroundRoute'))
app.use('/command', require('./routes/CommandRoute'))

const server = app.listen(node_port, () => {
  console.log(`Server started on port ${node_port} in mode ${node_env}`);
});

const wss = new WebSocket.Server({ server: server });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        message = JSON.parse(message);
        message.type = message.type.toUpperCase()
        console.log('Received message')
    })
})