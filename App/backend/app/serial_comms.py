# Requires PySerial     pip install PySerial
import serial
from serial.tools import list_ports
from protocol import *
import time

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
def serial_task(port):
    PORT = port
    BAUDRATE = 115200
    BYTESIZE = 8
    TIMEOUT = 2
    STOPBITS = serial.STOPBITS_ONE

    try:
        serial_port = serial.Serial(port = PORT, baudrate = BAUDRATE,
                            bytesize=BYTESIZE, timeout=TIMEOUT, stopbits=STOPBITS)
    except serial.serialutil.SerialException:
        print('No communications with {}'.format(PORT))
        return

    # print('Port is open? ' + str(serial_port.is_open))

    data_from_serial = ''
    while True:
        try:
            data_from_serial = serial_port.readline()
            if data_from_serial:
                r = parse(data_from_serial)
                if r['error']:
                    print('Received message with errors')
                else:
                    print('Received message with no errors')
                    # Add data to database here!!
        except serial.serialutil.SerialException:
            print('Lost communications with {}'.format(PORT))
            return

    
if __name__ == "__main__":
    # Print teensy information
    # print('\nPrinting Teensy serial port, if it exists...')
    # port = find_teensy_port()
    # if port:
    #     print('Device: ' + port.device)
    #     print('\tDescription: ' + port.description)
    #     print('\tHardware ID: ' + port.hwid)
    # else:
    #     print('Teensy is not connected')

    # # List all ports
    # print('\nPrinting all serial ports...')
    # ports = get_all_ports()
    # for index, port_info in enumerate(ports, 1):
    #     print('Device ' + str(index) + ': ' + port_info.device)
    #     print('\tDescription: ' + port_info.description)
    #     print('\tHardware ID: ' + port_info.hwid)

    # System design
        # 1) periodic task that checks if there is a teensy plugged into a port
        #       if returns a real value, pass port to serial task and start polling it

    while True:
        port_info = find_teensy_port()
        if port_info:
            break
        else:
            print('Waiting for Teensy')
            time.sleep(1)
        
    print('Teensy Connected! \nSerial Task Starting...')
    serial_task(port_info.device)