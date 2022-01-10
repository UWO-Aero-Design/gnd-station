const mongoose = require('mongoose');
const usb_device = require('./usb').device
const Record = require('../models/RecordingModel')

const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const name = process.env.DB_NAME

const options = {
  // database is hosted locally, fail quickly so user can see
  serverSelectionTimeoutMS: 3000,
  dbName: name
};


const connect = () => {
  // settings for depreciated features
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useUnifiedTopology', true);

  console.log(`Connecting to database at mongodb://${user}:${pass}@${host}:${port}`)

  mongoose.connect(`mongodb://${user}:${pass}@${host}:${port}`, options)
    .then(() => { console.log(`Connected to database at mongodb://${user}:<password>@${host}:${port}/${name}`) })
    .catch((err) => { console.log('\x1b[33mUnable to connect to database. Continuing without logging.\x1b[0m'); })
};

usb_device.on('data', async (recevived_message) => {
  if(Record.is_recording()) {
    const recording = await Record.findById(Record.get_current_recording());
    await recording.add_telemetry(recevived_message.toObject())
  }
})

usb_device.on('sent', async (sent_message) => {
  if(Record.is_recording()) {
    const recording = await Record.findById(Record.get_current_recording());
    await recording.add_command(sent_message.toObject())
  }
})

module.exports = {
  connect,
  mongoose
};