let socket;

const UPDATE_RATE = 10;
const TLM_TIMEOUT = 500;

let connected_to_server = false;
let update_task, tlm_watchdog, tlm_status = false, tlm_new_msg = false;

let ground_level_offset = 0, glider_drop_height = 0, payload_drop_height = 0;

let last_packet = 0;
let last_times = [];
let packet_number = 0;
let rssi = 0;
let enviro = {}, imu = {}, gps = {};

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

const watchdog_task = () => {
    set_system_status('server')
    document.getElementById('tlm-connected').innerHTML = 'Yes'
    tlm_status = false;
}

const time_to_string = (time) => {
    let string = ''
    string += time.getHours().toString().padStart(2, '0');
    string += ':' + time.getMinutes().toString().padStart(2, '0')
    string += ':' + time.getSeconds().toString().padStart(2, '0')
    string += ':' + time.getMilliseconds().toString().substring(0,2).padStart(2, '0')
    return string

}

const m_to_ft = (m) => {
    return m*3.281;
}

// from https://en.wikipedia.org/wiki/Dilution_of_precision_(navigation)
const get_hdop_text = (hdop) => {
    if(hdop === 1) return 'Ideal'
    else if(hdop === 2) return 'Excellent'
    else if(hdop <= 5) return 'Good'
    else if(hdop <= 10) return 'Moderate'
    else if(hdop <= 20) return 'Fair'
    else if(hdop > 20) return 'Poor'
}

const DMS_to_DD = (lon, lat, lat_direction = 'N', lon_direction = 'W') => {
    // based off of the output given here: https://learn.adafruit.com/adafruit-ultimate-gps/direct-computer-wiring
    let lon_degrees = parseInt(lon.toString().substring(0,2)), lon_minutes = parseFloat(lon.toString().substring(2))
    let lat_degrees = parseInt(lat.toString().substring(0,2)), lat_minutes = parseFloat(lat.toString().substring(2))

    console.log(lon_degrees)

    let lon_dd = lon_degrees + lon_minutes/60;
    let lat_dd = lat_degrees + lat_minutes/60;
    
    if (lat_direction.toUpperCase() == 'S') lat_dd = lat_dd * -1;
    if (lon_direction.toUpperCase() == 'W') lon_dd = lon_dd * -1;

    console.log(lon_dd)
    console.log(lat_dd)

    return { lon_dd, lat_dd };
}

const connect = () => {
    socket = new WebSocket('ws://localhost:5001');
    socket.onopen = (event) => {
        connected_to_server = true;
        update_task = setInterval(update, UPDATE_RATE)
        set_system_status('server')
    }
    
    socket.onclose = (event) => {
        console.log('Disconnected')
        connected_to_server = false;
        clearInterval(update_task);
        setTimeout(connect, 500)
        set_system_status('disconnected')
    }
    
    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        VOT = convert_ms_to_timestamp(data.time);
        packet_number = data.packetNumber;
        rssi = data.rssi;
        if(data.enviro) enviro = data.enviro;
        if(data.imu) imu = data.imu;
        if(data.gps) gps = data.gps;
        else gps = undefined;
        last_packet = performance.now();
        last_times.push(last_packet);
        if(!tlm_status) {
            tlm_status = true;
            set_system_status('ready');
        }
        clearTimeout(tlm_watchdog)
        tlm_watchdog = setTimeout(watchdog_task, TLM_TIMEOUT);
        tlm_new_msg = true;
    };
}

connect()



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

const update_local_times = () => {
    document.getElementById('GCT').innerHTML = time_to_string(convert_ms_to_timestamp(performance.now()))
    document.getElementById('CLT').innerHTML = time_to_string(new Date())
    if(tlm_status) document.getElementById('VOT').innerHTML = time_to_string(new Date(VOT.getTime() + performance.now() - last_packet))
}

setInterval(update_local_times, UPDATE_RATE)

const update = () => {
    if(tlm_new_msg) {
        let update_rate = 0;
        while(last_times.length > 10) last_times.shift()
        if(last_times.length > 0) {
            let sum = 0;
            for(let i = 0; i < last_times.length-1; i++) {
                sum += last_times[i+1] - last_times[i]
            }
            update_rate = 1000/(sum/last_times.length)
        }

        let formatted_packet_number = "";
        if(packet_number > 1e9) formatted_packet_number = '10e9+'
        else if(packet_number > 1e6) formatted_packet_number = (packet_number/1e6).toFixed(2).toString() + 'm'
        else if(packet_number > 1e3) formatted_packet_number = (packet_number/1e3).toFixed(2).toString() + 'k'
        else formatted_packet_number = packet_number

        document.getElementById('MIT').innerHTML = time_to_string(MIT)
        document.getElementById('tlm-rate').innerHTML = update_rate.toFixed(1).toString()
        document.getElementById('packet-number').innerHTML = formatted_packet_number;
        document.getElementById('current-height').innerHTML = enviro.altitude ? (m_to_ft(enviro.altitude)-ground_level_offset).toFixed(2) : 0;
        document.getElementById('enviro-alt').innerHTML = enviro.altitude ? enviro.altitude.toFixed(2) : 0;
        document.getElementById('enviro-temp').innerHTML = enviro.temperature ? enviro.temperature.toFixed(2) : 0;
        document.getElementById('enviro-pressure').innerHTML = enviro.pressure ? enviro.pressure.toFixed(2) : 0;
        document.getElementById('imu-ax').innerHTML = imu.ax ? imu.ax.toFixed(2) : 0;
        document.getElementById('imu-ay').innerHTML = imu.ay ? imu.ay.toFixed(2) : 0;
        document.getElementById('imu-az').innerHTML = imu.az ? imu.az.toFixed(2) : 0;
        document.getElementById('imu-mx').innerHTML = imu.mx ? imu.mx.toFixed(2) : 0;
        document.getElementById('imu-my').innerHTML = imu.my ? imu.my.toFixed(2) : 0;
        document.getElementById('imu-mz').innerHTML = imu.mz ? imu.mz.toFixed(2) : 0;
        document.getElementById('imu-gx').innerHTML = imu.gx ? imu.gx.toFixed(2) : 0;
        document.getElementById('imu-gy').innerHTML = imu.gy ? imu.gy.toFixed(2) : 0;
        document.getElementById('imu-gz').innerHTML = imu.gz ? imu.gz.toFixed(2) : 0;
        document.getElementById('tlm-rssi').innerHTML = rssi;
        document.getElementById('tlm-connected').innerHTML = 'Yes'
        if(gps) {
            let { lon_dd, lat_dd } = DMS_to_DD(gps.lon, gps.lat)
            document.getElementById('gps-fix').innerHTML = gps.fix ? 'Yes' : 'No';
            document.getElementById('gps-lat').innerHTML = gps.lat ? lon_dd.toFixed(5) : 0;
            document.getElementById('gps-lon').innerHTML = gps.lon ? lat_dd.toFixed(5) : 0;
            document.getElementById('gps-sats').innerHTML = gps.satellites ? gps.satellites : 0;
            document.getElementById('gps-alt').innerHTML = gps.altitude ? gps.altitude.toFixed(2) : 0;
            document.getElementById('gps-hdop').innerHTML = gps.hdop ? get_hdop_text(gps.hdop) : '--';
        }
        tlm_new_msg = false;
    }
}

const handle_command = (event) => {
    let data = { commands: [ event.id ] }
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE) {
            if(this.status == 200) {
                console.log(`${xmlhttp.response}: ${JSON.stringify(data)}`);
            }
            else if(this.status == 406) {
                console.log('Invalid command');
            }
            else {
                console.log('Error');
            }
        }
    };
    xmlhttp.open('POST', 'http://localhost:5000/command', true);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(data));

    if(event.id === 'drop_payload') {
        payload_drop_height = enviro.altitude;
        document.getElementById('payload-drop-height').innerHTML = (m_to_ft(payload_drop_height)-ground_level_offset).toFixed(2);
    }
    if(event.id === 'drop_gliders') {
        glider_drop_height = enviro.altitude;
        document.getElementById('glider-drop-height').innerHTML = (m_to_ft(glider_drop_height)-ground_level_offset).toFixed(2);
    }
}

const set_system_status = (status) => {
    status = status.toUpperCase();
    const label = document.getElementById('system-status');
    switch(status) {
        case 'DISCONNECTED':
            label.innerHTML = 'Disconnected'
            label.className = 'status red'
            break;
        case 'SERVER':
            label.innerHTML = 'Server Connection'
            label.className = 'status green'
            break;
        case 'CALLIBRATING':
            label.innerHTML = 'Callibrating'
            break;
        case 'READY':
            label.innerHTML = 'Ready'
            label.className = 'status blue'
            break;
        case 'RECORDING':
            label.innerHTML = 'Recording'
            break;
    }
}
set_system_status('disconnected')

document.getElementById('ground-level-offset').oninput = (event) => {
    const value = parseFloat(event.target.value) 
    if(isNaN(value)) ground_level_offset = 0
    else ground_level_offset = value;
    if(payload_drop_height > 0) {
        document.getElementById('payload-drop-height').innerHTML = (m_to_ft(payload_drop_height)-ground_level_offset).toFixed(2);
    }
    if(glider_drop_height > 0) {
        document.getElementById('glider-drop-height').innerHTML = (m_to_ft(glider_drop_height)-ground_level_offset).toFixed(2);
    }
}