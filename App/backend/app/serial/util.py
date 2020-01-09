# Serial utility functions

def calculate_chksum(buffer):
    """ Calculate simple checksum by XOR'ing each byte in the buffer
        Returns the checksum
    """
    checksum = 0
    
    for b in buffer:
        if not b == '\n':
            checksum ^= int(b, 16)
    
    return checksum


def is_bit_set(n, k):
    ''' 
        Returns true if the kth bit is set in the integer n
    '''
    if n & (1 << (k - 1)): 
        return True
    else: 
        return False

def signed_int16(b, endian='big'):
    '''
        Converts a list of two integers into a single signed integer assuming the integers in the list represent bytes\n
        b is the list of bytes\n
        (optional) endian is byte the byte order. Default big endian.
    '''
    if len(b) != 2:
         raise Exception('List of bytes must be of length 2. Actual is: {}'.format(len(b)))

    # Converts list of integers into single integer
    return int.from_bytes(b, byteorder=endian, signed=True)

def unsigned_int16(b, endian='big'):
    '''
        Converts a list of two integers into a single unsigned integer assuming the integers in the list represent bytes\n
        b is the list of bytes\n
        (optional) endian is byte the byte order. Default big endian.
    '''
    if len(b) != 2:
         raise Exception('List of bytes must be of length 2. Actual is: {}'.format(len(b)))

    return int.from_bytes(b, byteorder=endian, signed=False)

def signed_int32(b, endian='big'):
    '''
        Converts a list of four integers into a single signed integer assuming the integers in the list represent bytes\n
        b is the list of bytes\n
        (optional) endian is byte the byte order. Default big endian.
    '''
    if len(b) != 4:
         raise Exception('List of bytes must be of length 4. Actual is: {}'.format(len(b)))

    # Converts list of integers into single integer
    return int.from_bytes(b, byteorder=endian, signed=True)

def unsigned_int32(b, endian='big'):
    '''
        Converts a list of four integers into a single unsigned integer assuming the integers in the list represent bytes\n
        b is the list of bytes\n
        (optional) endian is byte the byte order. Default big endian.
    '''
    if len(b) != 4:
         raise Exception('List of bytes must be of length 4. Actual is: {}'.format(len(b)))

    return int.from_bytes(b, byteorder=endian, signed=False)
