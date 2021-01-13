const mongoose = require('mongoose');

const options = {
  connectTimeoutMS: 10000,
};


const connect = uri => {
  // settings for depreciated features
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useUnifiedTopology', true);
  mongoose.connect(`${process.env.DB_HOST}:${process.env.DB_PORT}`, options)
    .then(() => { console.log('Connected to database') })
    .catch((err) => { console.log('\x1b[33mUnable to connect to database. Continuing without logging.\x1b[0m') })
};

module.exports = {
  connect,
  mongoose
};