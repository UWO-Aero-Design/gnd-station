const path = require('path');

const express = require('express');
const morgan = require('morgan');
// const dotenv = require('dotenv').config({ path: '../.env' })
const dotenv = require('dotenv').config()

// app configuration
require('dotenv').config({path: path.join(__dirname, '..', '.env')})
require('./config/database.js').connect()
const node_port = process.env.API_PORT;
const node_env = process.env.NODE_ENV || 'development';
const app = express();
const wss = require('./services/websocket/ws')

// middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

// ejs registration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views')) 

// routes
app.get('/favicon.ico', express.static(path.join('public', 'images', 'favicon.png')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views/index.html')))
app.use('/docs', require('./routes/DocRoute'))
app.use('/onboardconfig', require('./routes/OnboardRoute'))
app.use('/record', require('./routes/RecordRoute'))
app.use('/ground', require('./routes/GroundRoute'))
app.use('/command', require('./routes/CommandRoute'))

const server = app.listen(node_port, () => {
  console.log(`Server started on port ${node_port} in mode ${node_env}`);
});

// for testing only
const data_interface = require('./services/data_interface/data_interface')
