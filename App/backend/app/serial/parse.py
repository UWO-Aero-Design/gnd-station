# Message parser
# File containing functions that dictate how a serial buffer will be parsed based on the aero message protocol
from definitions import *
from util import calculate_chksum

def parse(buf):
    # Convert buffer of byte array into ascii encoded list of strings
    buf = buf.decode('ascii').split(' ')
    # Used to track progress within the buffer
    
    # TODO: Stuff this into a class perhaps?
    buf_ptr = 0

    # Get start byte
    start = buf[buf_ptr:buf_ptr+BYTE]
    start = ''.join(start[::-1])
    buf_ptr += BYTE

    # # Get link
    link = buf[buf_ptr:buf_ptr+TWO_BYTES]
    link = ''.join(link[::-1])
    from_id = int(link[0])
    to_id = int(link[1])
    buf_ptr += TWO_BYTES
    
    # Get signature
    sig = buf[buf_ptr:buf_ptr+TWO_BYTES]
    #sig = ''.join(sig[::-1])
    sig = [int(i, 16) for i in sig]
    sig = unsigned_int16(sig, 'little')
    buf_ptr += TWO_BYTES

    # Get length
    p_len = buf[buf_ptr:buf_ptr+BYTE]
    p_len = ''.join(p_len[::-1])
    buf_ptr += BYTE

    # Get buffer
    data_buf = buf[buf_ptr:buf_ptr+int(p_len, 16)]
    data_buf = ' '.join(data_buf[::-1])
    buf_ptr += int(p_len, 16)

    # Get CRC
    crc = buf[buf_ptr:buf_ptr+TWO_BYTES]
    crc = ''.join(crc[::-1])
    buf_ptr += TWO_BYTES

    # Get end
    end = buf[buf_ptr:buf_ptr+BYTE]
    end = ''.join(end[::-1])
    buf_ptr += BYTE

    # Print message
    DEBUG = False
    if DEBUG:
        print('\n*** NEW MESSAGE ***')
        print('Full Message: {}'.format(buf))
        print('Start: {}'.format(start))
        print('Link: {} meaning from: {} and to: {}'.format(link, ID_LOOKUP[from_id], ID_LOOKUP[to_id]))
        print('Signature: {}'.format(sig))
        print('Buffer Length: {}'.format(p_len))
        print('Buffer: {}'.format(data_buf))
        print('CRC: {}'.format(crc))
        print('End: {}'.format(end))
        print('*** MESSAGE END ***')

    # Check message first
    if not validate(buf, p_len, crc, start, end):
        return [], True
    else:
        return extract_from_buffer(sig, data_buf), False

def extract_from_buffer(signature: int, buf):
    """ Extracts real data from message buffer

        Important to note that this function starts from the end of the buffer
        and works its way to the start. Hence bptr -= SIZE
    """

    buf = buf.split(' ')
    buf = [int(i, 16) for i in buf] 
    # Pointer in buffer
    bptr = len(buf)

    parsed_data = 11*[None]

    DEBUG = True

    if DEBUG == True:
        print('\nBuffer parsing...')
        print(buf)
    
    if is_bit_set(signature, Pitot.ID + 1):
        parsed_data[Pitot.ID] = Pitot(buf[bptr-Pitot.SIZE:bptr])
        bptr -= Pitot.SIZE
        
    if is_bit_set(signature, IMU.ID + 1):
        parsed_data[IMU.ID] = IMU(buf[bptr-IMU.SIZE:bptr])
        bptr -= IMU.SIZE
        
    if is_bit_set(signature, GPS.ID + 1):
        parsed_data[GPS.ID] = GPS(buf[bptr-GPS.SIZE:bptr])
        bptr -= GPS.SIZE

    if is_bit_set(signature, Enviro.ID + 1):
        parsed_data[Enviro.ID] = Enviro(buf[bptr-Enviro.SIZE:bptr])
        bptr -= Enviro.SIZE

    if is_bit_set(signature, Battery.ID + 1):
        parsed_data[Battery.ID] = Battery(buf[bptr-Battery.SIZE:bptr])
        bptr -= Battery.SIZE

    if is_bit_set(signature, Config.ID):
        parsed_data[Config.ID] = Config(buf[bptr-Config.SIZE:bptr])
        bptr -= Config.SIZE

    if is_bit_set(signature, Status.ID + 1):
        parsed_data[Status.ID] = Status(buf[bptr-Status.SIZE:bptr])
        bptr -= Status.SIZE

    if is_bit_set(signature, Servos.ID + 1):
        parsed_data[Servos.ID] = Servos(buf[bptr-Servos.SIZE:bptr])
        bptr -= Servos.SIZE

    if is_bit_set(signature, AirData.ID + 1):
        parsed_data[AirData.ID] = AirData(buf[bptr-AirData.SIZE:bptr])
        bptr -= AirData.SIZE

    if is_bit_set(signature, Commands.ID + 1):
        parsed_data[Commands.ID]  = Commands(buf[bptr-Commands.SIZE:bptr])
        bptr -= Commands.SIZE

    if is_bit_set(signature, DropAlgo.ID +1):
        parsed_data[DropAlgo.ID] = DropAlgo(buf[bptr-DropAlgo.SIZE:bptr])
        bptr -= DropAlgo.SIZE

    if DEBUG:
        for data in parsed_data:
            print(data)
        
    return parsed_data

def validate(buf, dlen, crc, start, end):
    """ Checks to see if the message is valid before parsing
        Returns True if valid
        Returns False and an error code if not valid

        Conditions for validitiy
            First byte is START_BYTE
            Last byte is END_BYTE
            Checksum of buffer equals checksum in message header
            Length of message is correct
    """

    valid_length = True
    valid_crc = True
    valid_startend = True

    if len(buf) > int(dlen, 16) + 9 + 1:
        valid_length = False
    
    if calculate_chksum(buf) != crc:
        valid_crc = False

    if start != START_BYTE or end != END_BYTE:
        valid_startend = False
        
    return valid_length
    #return valid_length and valid_crc and valid_startend

# if __name__ == "__main__":
#     validate([1,1,1], 'FF', 0 ,0 ,0)
#     extract_from_buffer(1, '1 1 1 1')