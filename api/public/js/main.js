let socket = new WebSocket('ws://localhost:5001');

let last_packet = 0;
let last_times = [];
let packet_number = 0;
let enviro = {};

let VOT = new Date();
VOT.setHours(0)
VOT.setMinutes(0)
VOT.setSeconds(0)
VOT.setMilliseconds(0)

let MIT = new Date();
MIT.setHours(0)
MIT.setMinutes(0)
MIT.setSeconds(0)
MIT.setMilliseconds(0)

const time_to_string = (time) => {
    let string = ''
    string += time.getHours().toString().padStart(2, '0');
    string += ':' + time.getMinutes().toString().padStart(2, '0')
    string += ':' + time.getSeconds().toString().padStart(2, '0')
    string += ':' + time.getMilliseconds().toString().substring(0,2).padStart(2, '0')
    return string

}

socket.onopen = (event) => {
    console.log('Connected')
}

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    VOT = convert_ms_to_timestamp(data.time);
    packet_number = data.packetNumber;
    if(data.enviro) enviro = data.enviro;
    last_packet = performance.now();
    last_times.push(last_packet);
};



const convert_ms_to_timestamp = (milliseconds) => {
    let hours, minutes, seconds;
    seconds = Math.floor(milliseconds / 1000);
    minutes = Math.floor(seconds / 60);
    hours = Math.floor(minutes / 60);
    milliseconds = milliseconds % 1000;
    seconds = seconds % 60;
    minutes = minutes % 60;
    hours = hours % 24;
    let time = new Date();
    time.setHours(hours)
    time.setMinutes(minutes)
    time.setSeconds(seconds)
    time.setMilliseconds(milliseconds)
    return time
}

const update = () => {
    let update_rate = 0;
    while(last_times.length > 10) last_times.shift()
    if(last_times.length > 0) {
        let sum = 0;
        for(let i = 0; i < last_times.length-1; i++) {
            sum += last_times[i+1] - last_times[i]
        }
        update_rate = 1000/(sum/last_times.length)
    }

    document.getElementById('CLT').innerHTML = time_to_string(new Date())
    document.getElementById('VOT').innerHTML = time_to_string(new Date(VOT.getTime() + performance.now() - last_packet))
    document.getElementById('GCT').innerHTML = time_to_string(convert_ms_to_timestamp(performance.now()))
    document.getElementById('MIT').innerHTML = time_to_string(MIT)
    document.getElementById('tlm-rate').innerHTML = update_rate.toFixed(1).toString()
    document.getElementById('packet-number').innerHTML = packet_number > 1000 ? (packet_number/1000).toFixed(2) + 'k' : packet_number;
    document.getElementById('current-height').innerHTML = enviro.altitude ? enviro.altitude.toFixed(2) : 0;
    document.getElementById('temperature').innerHTML = enviro.temperature ? enviro.temperature.toFixed(2) : 0;
    setTimeout(update, 10);
}

setTimeout(update, 10);