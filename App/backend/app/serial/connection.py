import time

# Serial dependencies
import serial
from serial.tools import list_ports

# Message parser
from app.serial import parse
from app.serial.parse import parse

# Event for serial
from app.serial import events 
from app.serial.events import post_serial_read, pre_serial_write

from flask_socketio import emit,send
from .. import socketio

from app import database
from app.database import databasehelperclass

from .. import dbase
from .. import serialWriteEvent

import time

# Configuration for Serial connection
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
                              timeout = 2,
                              stopbits = 1)

def get_all_ports():
    """ Returns a list of ListPortInfo objects that represents all
        connected AND available serial devices
    """

    return serial.tools.list_ports.comports()

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

# Serial task will connect to database
def serial_task(app,port : str, config : SerialConfig = None, on_read = None, on_write = None):
    """ Continuously executes a serial task with callbacks for when a
        read event occurs and for when a write event occurs

        Uses default serial config if not specified

        port is a ListPortInfo object for the device that you want to communicate with
    """

    # If user did not supply the function with a config object, use the default
    c = DEFAULT_CONFIG if config == None else config

    # Try establishing a connection
    try:
        serial_port = serial.Serial(port = port.device, 
                                    baudrate = c.baud,
                                    bytesize=c.bytesize, 
                                    timeout=c.timeout, 
                                    stopbits=c.stopbits)

        print('Communication established')
        print('Serial port open') if serial_port.is_open else print('Serial port not open')
    except serial.serialutil.SerialException:
        print('Communication failure with port: {}'.format(port))
        return

    while True:
        # read, write, repeat until communications with port is lost
        try:
            port_read(app,serial_port, on_read)
            port_write(app,serial_port, on_write)
            time.sleep(0.1)
            
        except serial.serialutil.SerialException:
            print('Lost communications with {}'.format(port.device))
            return

def port_read(app,serial_port, event=None):
    """ Read a line of data from serial_port

        If a post read event was passed in, execute it
    """

    data_from_serial = serial_port.readline()
    if data_from_serial:
        try:
            result, error = parse(data_from_serial)

            if error:
                print('Received message with errors')
            else:
                print('Received message with no errors')
                if event:
                    print("Passing Event")
                    # Can pass result into event
                    event(app,result)
        except:
            print('Exception while parsing message')
        
    else:
        print('Failed to receive message')

def port_write(app, serial_port, event):
    """ Send a line of data to serial_port

        event is used to build the message required for the port
    """
    global serialWriteEvent

    if serialWriteEvent.isSet():
        print("Sending Data")
        dataOut = event(app)

        if not serial_port.out_waiting > 0:
            print(serial_port.is_open)
            #serial_port.flush()
            serial_port.write(dataOut)
            print("Data Sent")
        
        #time.sleep(1)

        # if serial_port.in_waiting:
        #     data = serial_port.readline().decode('ascii').strip()
        #     print( data )

        serialWriteEvent.clear()
    else:
        print("No data to send")
    
# Run file as script to test functionality
def serial_data(app):
    # Wait for Teensy to be plugged in before communicating with it
    # Communicate with teensy until it has been unplugged
    # Wait for a Teensy to be connected again

    #dbase.session.close()
    while True:
        while True:
            port_info = find_teensy_port()
            if port_info:
                break
            else:
                print('Waiting for Teensy')
                socketio.emit('connectStatus','Waiting for Connection')
                time.sleep(2)
            
        print('Teensy Connected! \nSerial Task Starting...')
        socketio.emit('connectStatus','Groundstation Connection Established')
        #time.sleep(2)

        # Start serial task
        serial_task(app,
                    port = port_info, 
                    on_read = post_serial_read,
                    on_write = pre_serial_write)

        print('Teensy Disconnected! \nSerial Task Ended')

def databaseinsertion(obj):
    #databasehelperclass.db.session.add(obj)
    #databasehelperclass.db.session.commit()

    dbase.session.add(obj)
    dbase.session.commit()