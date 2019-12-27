from app.base import api
from flask import session,jsonify
from flask_socketio import emit,send
from .. import socketio
import threading
import time
import math

import eventlet
eventlet.monkey_patch()

@api.route('/')
def index():
    return "Hello"

@api.route('/Ping')
def ping():
    return jsonify({'status':'pinged'})

@socketio.on('Test')
def send_test(data):
    print("Hi")
    emit('dataChannel',"hi")
    
@api.before_app_first_request
def activate_job():
    def run_task():
        latc = 27.96
        lonc = -82.02
        alt = 0
        t = 1
        r = 0.01
        while True:
            lat = latc + r*math.cos(t)
            lon = lonc + r*math.cos(t)
            alt = alt + 1
            t = t + 1
            socketio.emit('dataChannel',{'latitude':lat,'longitude':lon,'altitude':alt})
            socketio.emit('connectStatus',{'connect':'true'})

            time.sleep(1)

    #thread = threading.Thread(target=Serial.connection.serial_data)
    #thread.start()
    thread = threading.Thread(target=run_task)
    thread.start()