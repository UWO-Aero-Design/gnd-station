# Serial utility functions
import struct

def calculate_chksum(buffer):
    """ Calculate simple checksum by XOR'ing each byte in the buffer
        Returns the checksum
    """
    checksum = 0
    
    for b in buffer:
        if not b == '\n':
            checksum ^= int(b, 16)
    
    return checksum

def set_bit(v, index, x):
  """Set the index:th bit of v to 1 if x is truthy, else to 0, and return the new value."""
  mask = 1 << index   # Compute mask, an integer with just bit 'index' set.
  v &= ~mask          # Clear the bit indicated by the mask (if x is False)
  if x:
    v |= mask         # If x was True, set the bit indicated by the mask.
  return v            # Return the result, we're done.

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


def uint8_to_bytes(value):
    return struct.pack('<B', value)

def int8_to_bytes(value):
    return struct.pack('<b', value)
    
def uint16_to_bytes(value):
    return struct.pack('<H', value)

def int16_to_bytes(value):
    return struct.pack('<h', value)

def uint32_to_bytes(value):
    return struct.pack('<L', value)

def int32_to_bytes(value):
    return struct.pack('<l', value)
