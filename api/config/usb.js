const SerialPort = require('serialport') 
const Readline = require('@serialport/parser-readline')

var current_port = null;
var parser = null;

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
    parser = current_port.pipe(new Readline())
    return current_port;
}

module.exports = {
    current_port,
    parser,
    write,
    list,
    select
}