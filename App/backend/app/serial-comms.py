# Requires PySerial     pip install PySerial
import serial
from serial.tools import list_ports

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
def serial_task():
    PORT = "COM3"
    BAUDRATE = 115200
    BYTESIZE = 8
    TIMEOUT = 2
    STOPBITS = serial.STOPBITS_ONE

    MIN_SERIAL_BUFFER = 100

    serial_port = serial.Serial(port = PORT, baudrate = BAUDRATE,
                            bytesize=BYTESIZE, timeout=TIMEOUT, stopbits=STOPBITS)

    print('Port is open? ' + str(serial_port.is_open))
    print('Waiting for buffer to fill up...')

    data_from_serial = ''
    # Wait for the buffer to be at least a bit full and then read all bytes that are in the buffer
    while True:
        if serial_port.in_waiting  > MIN_SERIAL_BUFFER:
            data_from_serial = serial_port.read(serial_port.in_waiting)
            print(data_from_serial)
    
if __name__ == "__main__":
    # Print teensy information
    print('\nPrinting Teensy serial port, if it exists...')
    port = find_teensy_port()
    if port:
        print('Device: ' + port.device)
        print('\tDescription: ' + port.description)
        print('\tHardware ID: ' + port.hwid)
    else:
        print('Teensy is not connected')

    # List all ports
    print('\nPrinting all serial ports...')
    ports = get_all_ports()
    for index, port_info in enumerate(ports, 1):
        print('Device ' + str(index) + ': ' + port_info.device)
        print('\tDescription: ' + port_info.description)
        print('\tHardware ID: ' + port_info.hwid)

    print('\nRunning serial task...')
    serial_task()
