#Websocket
from flask import session,jsonify
from flask_socketio import emit,send
from .. import socketio
import time
import random

from app import database
from app.database import databasehelperclass,queryDatabase

from .. import dbase
from .. import serialDataOut

from app.serial import builder
from app.serial.builder import *

from app.serial import definitions
from app.serial.definitions import *

# from builder import *
# from definitions import *

import eventlet
eventlet.monkey_patch()

random.seed()

point = 0

# Event handler that can be passed to the serial task in order to handle a receive event
def post_serial_read(app,data = None):
    print('Serial receive')

    global point
    point += 1

    #Database insertions
    #All database access should be inside app context since this is running in a background thread
    # with app.app_context():
    #     databaseObj = databasehelperclass.pointtable(1,point)
    #     databaseinsertion(databaseObj)

    #     IMUData = data[1]
    #     databaseObj = databasehelperclass.imuvaluestable(float(IMUData.ax),float(IMUData.ay),float(IMUData.az),
    #         float(IMUData.yaw),float(IMUData.pitch),float(IMUData.roll),
    #         float(IMUData.mx),float(IMUData.my),float(IMUData.mz),
    #         float(IMUData.gx),float(IMUData.gy),float(IMUData.gz),
    #         1,point)
    #     databaseinsertion(databaseObj)

    #     GPSData = data[2]
    #     databaseObj = databasehelperclass.gpsvaluetable(float(GPSData.lat),float(GPSData.lon),float(GPSData.speed),
    #         float(GPSData.satellites),float(GPSData.altitude),float(GPSData.time),
    #         int(GPSData.date),1,point)
    #     databaseinsertion(databaseObj)

    #     EnviroData = data[3]
    #     databaseObj = databasehelperclass.environmentalsensortable(float(EnviroData.pressure),
    #         float(EnviroData.humidity),
    #         float(EnviroData.temperature),
    #         1,point)
    #     databaseinsertion(databaseObj)

    #     BatteryData = data[4]
    #     databaseObj = databasehelperclass.batterystatustable(float(BatteryData.voltage),
    #         float(BatteryData.current),
    #         1,point)
    #     databaseinsertion(databaseObj)

    #     StatusData = data[6]
    #     databaseObj = databasehelperclass.systemstatustable(float(StatusData.rssi),
    #         float(StatusData.state),
    #         1,point)
    #     databaseinsertion(databaseObj)

    #     ServoData = data[7]
    #     databaseObj = databasehelperclass.servodatatable(float(ServoData.servo0),
    #         float(ServoData.servo1),
    #         float(ServoData.servo2),
    #         float(ServoData.servo3),
    #         float(ServoData.servo4),
    #         float(ServoData.servo5),
    #         float(ServoData.servo6),
    #         float(ServoData.servo7),
    #         float(ServoData.servo8),
    #         float(ServoData.servo9),
    #         float(ServoData.servo10),
    #         float(ServoData.servo11),
    #         float(ServoData.servo12),
    #         float(ServoData.servo13),
    #         float(ServoData.servo14),
    #         float(ServoData.servo15),
    #         1,point)
    #     databaseinsertion(databaseObj)

    #Pass to frontend
    jsonData = {'lat':GPSData.lat + random.randint(-1000,1000),'lon':GPSData.lon + random.randint(-1000,1000),'altitude':GPSData.altitude + random.randint(-1000,1000),'speed':GPSData.speed + random.randint(-1000,1000),'time':GPSData.time + random.randint(-1000,1000),'satellites':GPSData.satellites + random.randint(-1000,1000),'date':GPSData.date + random.randint(-1000,1000)}
    print(jsonData)
    socketio.emit('dataChannel',jsonData)
    socketio.emit('connectStatus','Connected')
    #time.sleep(0.1)
    # The plan is here to take data that is parsed from the serial port and add it to the DB

# Event handler that is called before a write. should return a message to send over serial or None
def pre_serial_write(app,data = None):
    print('Serial write data gather')
    global serialDataOut

    builder = MessageBuilder()

    c = Commands()
    c.drop = int(serialDataOut.cmdDrop)
    c.servos = int(serialDataOut.cmdServo)
    c.pitch = int(serialDataOut.cmdPitch)

    # p = Pitot()
    # p.differential_pressure = 255

    # i = IMU()
    # i.ax = 31245

    # g = GPS()
    # g.lat = 31245
    # g.lon = 31245

    # e = Enviro()
    # e.pressure = 31245
    # e.humidity = 31245
    # e.temperature = 31245

    # print(uint16_to_bytes(31245))
    
    # builder.add(p)
    #builder.add(i)
    # builder.add(e)

    write_val = builder.build(0,2)
    print(write_val)
    print(len(write_val))

    #TODO: Preprocessing stuff
    
    #Replace serialDataOut with string of bytes
    return write_val
    # The plan here is to return a string of bytes to send over the serial port

def databaseinsertion(obj):
    #databasehelperclass.db.session.add(obj)
    #databasehelperclass.db.session.commit()

    dbase.session.add(obj)
    dbase.session.commit()