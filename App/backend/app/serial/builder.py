# Message builder
import time
import struct

# Serial dependencies
import serial
from serial.tools import list_ports

from util import *
from definitions import *

class MessageBuilder:
    def __init__(self):
        self.elements = [None]*11
        self.signature = 0
        self.length = 0

        self._reset()
    
    def _total_len(self):
        return Pitot.SIZE + IMU.SIZE + GPS.SIZE + Enviro.SIZE + Battery.SIZE + Config.SIZE + Status.SIZE + Servos.SIZE + AirData.SIZE + Commands.SIZE + DropAlgo.SIZE

    def _reset(self):
        self.elements = [None]*11

    def add(self, data):
        index = data.ID
        self.elements[index] = data
        self.signature = set_bit(self.signature, index, 1)

    def build(self, start_id, end_id):
        
        byte_str = bytes()

        start_id = uint8_to_bytes(start_id)
        end_id = uint8_to_bytes(end_id)

        # Add start byte
        byte_str += uint8_to_bytes(170) # 0xAA

        # Link; manually endian swapped
        byte_str += (end_id + start_id)

        # Signature
        byte_str += uint16_to_bytes(self.signature)
        
        length = 0
        result = bytes()

        for elem in self.elements:
            if elem:
                length += elem.SIZE
                result += elem.to_bytes()
        
        byte_str += uint8_to_bytes(length)
        byte_str += result
        
        # Extra zeros
        for i in range(0, self._total_len() - length):
            byte_str += uint8_to_bytes(0)

        # crc
        byte_str += uint16_to_bytes(0)
        
        # Add end byte
        byte_str += uint8_to_bytes(255) # 0xFF

        self._reset()

        return byte_str




class SerialConfig:
    def __init__(self, baud, bytesize, timeout, stopbits):
        # TODO: Add data encapsulation
        self.baud = baud
        self.bytesize = bytesize
        self.timeout = timeout
        self.stopbits = stopbits

# Default project configuration
DEFAULT_CONFIG = SerialConfig(baud = 115200, 
                              bytesize = 8, 
                              timeout = 1,
                              stopbits = 1)

def find_teensy_port():
    """ Returns ListPortInfo object for Teensy. 
        If no Teensy is connected, returns None. 

        A port with a Teensy connected is determined by scanning the description
        of all active serial ports and returning the first port that contains
        the string 'USB Serial Device'

        TODO: Improve Teensy port detection process because 'USB Serial Device' 
        may be used by other devices as well
    """

    ports = serial.tools.list_ports.comports()
    
    for port in ports:
        if 'USB Serial Device' in port.description:
            return port

    return None

if __name__ == "__main__":
    c = DEFAULT_CONFIG

    while True:
        port_info = find_teensy_port()
        if port_info:
            break
        else:
            print('Waiting for Teensy')
            time.sleep(2)

    try:
        serial_port = serial.Serial(port = 'COM3', 
                                    baudrate = c.baud,
                                    bytesize=c.bytesize, 
                                    timeout=c.timeout, 
                                    stopbits=c.stopbits)

        print('Communication established')
        print('Serial port open') if serial_port.is_open else print('Serial port not open')
    except serial.serialutil.SerialException:
        print('Communication failure with port: {}'.format(port_info.device))

    builder = MessageBuilder()

    while True:
        p = Pitot()
        p.differential_pressure = 255

        i = IMU()
        i.ax = 31245

        g = GPS()
        g.lat = 31245
        g.lon = 31245

        e = Enviro()
        e.pressure = 31245
        e.humidity = 31245
        e.temperature = 31245

        print(uint16_to_bytes(31245))
        
        builder.add(p)
        builder.add(i)
        builder.add(e)

        write_val = builder.build(0,2)
        print(write_val)
        print(len(write_val))



        #if not serial_port.out_waiting:
        if not serial_port.out_waiting > 0:
            serial_port.write(write_val)
        
        time.sleep(1)

        if serial_port.in_waiting:
            data = serial_port.readline().decode('ascii').strip()
            print( data )
