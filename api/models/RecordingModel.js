const mongoose = require('mongoose');
const messages = require('../message/message_pb')

const recording_schema = mongoose.Schema({
    name: { type: String, default: new Date() },
    location: {
        lon: { type: Number },
        lat: { type: Number },
        alt: { type: Number }
    },
    timesteps: [{ type: Object }]
},  { versionKey: false, timestamps: { createdAt: 'created_at' } } );

recording_schema.methods.add_timestep = async function(data) {
    const recording = this;
    recording.timesteps.push(new messages.Message());
    await recording.save();
  };

module.exports = mongoose.model('Recording', recording_schema);