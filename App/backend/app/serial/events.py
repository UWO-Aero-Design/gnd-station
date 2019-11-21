# Event handler that can be passed to the serial task in order to handle a receive event
def post_serial_read(data = None):
    print('Serial receive')
    # The plan is here to take data that is parsed from the serial port and add it to the DB

# Event handler that is called before a write. should return a message to send over serial or None
def pre_serial_write(data = None):
    print('Serial write')
    # The plan here is to return a string of bytes to send over the serial port