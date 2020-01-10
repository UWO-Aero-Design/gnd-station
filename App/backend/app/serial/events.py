#Websocket
from flask import session,jsonify
from flask_socketio import emit,send
from .. import socketio
import time
import random

import eventlet
eventlet.monkey_patch()

random.seed()

# Event handler that can be passed to the serial task in order to handle a receive event
def post_serial_read(data = None):
    print('Serial receive')

    GPSData = data[2]
    
    jsonData = {'lat':GPSData.lat + random.randint(-1000,1000),'lon':GPSData.lon + random.randint(-1000,1000),'altitude':GPSData.altitude + random.randint(-1000,1000),'speed':GPSData.speed + random.randint(-1000,1000),'time':GPSData.time + random.randint(-1000,1000),'satellites':GPSData.satellites + random.randint(-1000,1000),'date':GPSData.date + random.randint(-1000,1000)}
    print(jsonData)
    socketio.emit('dataChannel',jsonData)
    socketio.emit('connectStatus','Connected')
    time.sleep(0.1)
    # The plan is here to take data that is parsed from the serial port and add it to the DB

# Event handler that is called before a write. should return a message to send over serial or None
def pre_serial_write(data = None):

    print('Serial write')
    # The plan here is to return a string of bytes to send over the serial port