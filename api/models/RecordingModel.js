const mongoose = require('mongoose');
const messages = require('../message/message_pb')

let current_recording = null;

const recording_schema = mongoose.Schema({
    name: { type: String, default: new Date() },
    location: {
        lon: { type: Number },
        lat: { type: Number },
        alt: { type: Number }
    },
    telemetry: [{ type: Object, ref: messages.Message }],
    commands: [{ type: Object, ref: messages.Message }]
},  { versionKey: false, timestamps: { createdAt: 'created_at' } } );

recording_schema.methods.add_telemetry = async function(data) {
    const recording = this;
    recording.telemetry.push(new messages.Message());
    await recording.save();
};

recording_schema.methods.add_command = async function(data) {
    const recording = this;
    recording.commands.push(new messages.Message());
    await recording.save();
};

module.exports = mongoose.model('Recording', recording_schema);