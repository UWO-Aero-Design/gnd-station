const events = require('events');

const name = 'DUMMY_DRIVER'
const TELEMETRY_INTERVAL = 1000;

const event = new events.EventEmitter();

const init = () => {
    setInterval(() => {
        // generate random data
        const data = generate_data();

        // convert the JSON object to a string and send
        event.emit('telemetry', JSON.stringify({ data: data }))
    }, TELEMETRY_INTERVAL)
}

const process_command = (command, args) => {
    // pretend to process a command
    console.log(`[Dummy driver] Sending command ${command} with args ${JSON.stringify(args)}`)
}

// the following code generates random data
let packet_number = 0;
const generate_data = () => {
    // follows this format: https://github.com/UWO-Aero-Design/message/blob/master/proto/message.proto
    packet_number++;
    const date = new Date();

    let data = {
        sender: 1, // plane
        recipient: 0, // ground station
        packetNumber: packet_number,
        time: process.uptime(),
        status: 2, // READY
        rssi: -34,
        imu: {
            ax: random_from_interval(-1,1),
            ay: random_from_interval(-1,1),
            az: random_from_interval(-1,1),
            gx: random_from_interval(-1,1),
            gy: random_from_interval(-1,1),
            gz: random_from_interval(-1,1),
            mx: random_from_interval(-1,1),
            my: random_from_interval(-1,1),
            mz: random_from_interval(-1,1),
            yaw: random_from_interval(-90,90),
            pitch: random_from_interval(-30,30),
            roll: random_from_interval(-10,10)
        },
        gps: {
            fix: true,
            lon: 81.2795223+random_from_interval(-0.0000010,0.0000010),
            lat: 43.0095971+random_from_interval(-0.0000010,0.0000010),
            speed: 5+random_from_interval(-2,2),
            satellites: 14+random_int_from_interval(-2,2),
            altitude: 100+random_from_interval(-5,5),
            time: date.toTimeString(),
            date: date.toDateString()
        },
        enviro: {
            altitude: 100+random_from_interval(-5,5),
            temperature: 22+random_from_interval(-5,5),
            pressure: 101+random_from_interval(-10,10),
        },
        battery: {
            voltage: 22+random_from_interval(-0.2,0.2),
            current: 1+random_from_interval(-0.5,0.5)
        },
    }

    return data;
}

const random_from_interval = (min, max) => {
    return Math.random() * (max - min + 1) + min
}

const random_int_from_interval = (min, max) => {
    return Math.floor(random_from_interval(min, max))
}

module.exports = {
    name,
    init,
    event,
    process_command
}