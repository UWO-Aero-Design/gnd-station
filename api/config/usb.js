const SerialPort = require('serialport') 

var current_port = null;

const write = (data) => {
    return new Promise((resolve, reject) => {
        if(current_port == null) {
            console.log('\x1b[31mERROR: Current port has not yet been selected\x1b[0m')
            reject(new Error('Current port has not yet been selected'));
        }
        else {
            resolve(current_port.write(data));
        }
    })
}

const read = () => {
    console.log('WARNING: READ NOT YET IMPLEMENTED')
}

const list = () => {
    return SerialPort.list()
}

const select = async (path) => {
    if(current_port != null) {
        await current_port.close();
    }
    current_port = new SerialPort(path);
    return current_port;
}

module.exports = {
    current_port,
    write,
    read,
    list,
    select
}