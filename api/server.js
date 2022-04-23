const path = require('path');
const http = require('http')
const wss = require('./services/websocket/ws')
const cors = require('cors');


const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv').config()

// app configuration
require('dotenv').config({path: path.join(__dirname, '..', '.env')})
require('./services/database/database').connect()
const node_port = process.env.API_PORT;
const node_env = process.env.NODE_ENV || 'development';
const app = express();

// middlewares
app.use(cors());
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
app.use('/driver', require('./routes/DriverRoute'))

// create an http server out of the express app (so we can attach the websocket to the http server)
const server = http.createServer(app)
server.listen(node_port, () => {
  console.log(`Server started on port ${node_port} in mode ${node_env}`);
});

// pass the http server into the websocket module
wss.get_websocket(server);

// data interface requires the web socket to be setup
const data_interface = require('./services/data_interface/data_interface').init();
