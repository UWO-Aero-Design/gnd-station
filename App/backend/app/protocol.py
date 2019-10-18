BYTE = 1
TWO_BYTES = 2
FOUR_BYTES = 4

# Returns list of 12 elements
def parse(buf):
    parsed_message = 12*[None]
    buf = buf.decode('ascii')
    buf = buf.split(' ')

    print(buf)

    # Entire buffer length
    buf_len = len(buf)
    buf_ptr = 0

    # Get start byte
    start = buf[buf_ptr:buf_ptr+BYTE]
    start = ''.join(start[::-1])
    buf_ptr += BYTE

    # # Get link
    link = buf[buf_ptr:buf_ptr+TWO_BYTES]
    link = ''.join(link[::-1])
    from_id = link[0]
    to_id = link[1]
    buf_ptr += TWO_BYTES
    
    # # Get signature
    # print(buf[buf_ptr:])
    # sig = buf[buf_ptr:TWO_BYTES]
    # sig = sig[::-1]
    # buf_ptr += TWO_BYTES

    # # Get length
    # p_len = buf[buf_ptr:BYTE]
    # p_len = p_len[::-1]
    # buf_ptr += BYTE

    # Get 

    print('Start: {}'.format(start))
    print('Link: {}'.format(link))
    print('From: {}'.format(from_id))
    print('To: {}'.format(to_id))
    #print('Signature: {}'.format(sig))
    #print('Buffer Length: {}'.format(p_len))


    

