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
from .. import serialDataIn

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

#Scale values

PITOTSCALE = 1000
IMUSCALE = 100

GPSLATLONSCALE = 10000000
GPSALTSCALE = 10
GPSSPEEDSCALE = 100

ENVIROSCALE = 100

# Event handler that can be passed to the serial task in order to handle a receive event
def post_serial_read(app,data = None):
    print('Serial receive')

    global point
    point += 1

    global serialDataIn

    PitotData = data[0]
    serialDataIn.PitotData = PitotData
    #print(PitotData)

    IMUData = data[1]
    serialDataIn.IMUData = IMUData
    #print(IMUData)

    GPSData = data[2]
    serialDataIn.GPSData = GPSData
    #print(GPSData)

    EnviroData = data[3]
    serialDataIn.EnviroData = EnviroData
    #print(EnviroData)

    BatteryData = data[4]
    serialDataIn.BatteryData = BatteryData
    #print(BatteryData)

    StatusData = data[6]
    serialDataIn.StatusData = StatusData
    #print(StatusData)

    ServoData = data[7]
    serialDataIn.ServoData = ServoData
    #print(ServoData)

    #Database insertions and websocket messages
    #All database access should be inside app context since this is running in a background thread
    with app.app_context():
        databaseObj = databasehelperclass.pointtable(1,point)
        databaseinsertion(databaseObj)

        if PitotData is not None:
            PitotData.differential_pressure = PitotData.differential_pressure / PITOTSCALE
            jsonData = {'differentialpressure':PitotData.differential_pressure}
            # print(jsonData)
            socketio.emit('PitotChannel',jsonData)
            socketio.emit('connectStatus','Connected')
            databaseObj = databasehelperclass.pitottubetable(float(PitotData.differential_pressure),
                1,point)
            databaseinsertion(databaseObj)

        if IMUData is not None:
            IMUData.ax = IMUData.ax / IMUSCALE
            IMUData.ay = IMUData.ay / IMUSCALE
            IMUData.az = IMUData.az / IMUSCALE
            IMUData.gx = IMUData.gx / IMUSCALE
            IMUData.gy = IMUData.gy / IMUSCALE
            IMUData.gz = IMUData.gz / IMUSCALE
            IMUData.mx = IMUData.mx / IMUSCALE
            IMUData.my = IMUData.my / IMUSCALE
            IMUData.mz = IMUData.mz / IMUSCALE
            IMUData.yaw = IMUData.yaw / IMUSCALE
            IMUData.pitch = IMUData.pitch / IMUSCALE
            IMUData.roll = IMUData.roll / IMUSCALE

            jsonData = {'ax':IMUData.ax,
                        'ay':IMUData.ay,
                        'az':IMUData.az,
                        'gx':IMUData.gx,
                        'gy':IMUData.gy,
                        'gz':IMUData.gz,
                        'mx':IMUData.mx,
                        'my':IMUData.my,
                        'mz':IMUData.mz,
                        'yaw':IMUData.yaw,
                        'pitch':IMUData.pitch,
                        'roll':IMUData.roll}
            # print(jsonData)
            socketio.emit('IMUChannel',jsonData)
            socketio.emit('connectStatus','Connected')

            databaseObj = databasehelperclass.imuvaluestable(float(IMUData.ax),float(IMUData.ay),float(IMUData.az),
                float(IMUData.yaw),float(IMUData.pitch),float(IMUData.roll),
                float(IMUData.mx),float(IMUData.my),float(IMUData.mz),
                float(IMUData.gx),float(IMUData.gy),float(IMUData.gz),
                1,point)
            databaseinsertion(databaseObj)


        if GPSData is not None:
            GPSData.lat = GPSData.lat / GPSLATLONSCALE
            GPSData.lon = GPSData.lon / GPSLATLONSCALE
            GPSData.altitude = GPSData.altitude / GPSALTSCALE
            GPSData.speed = GPSData.speed / GPSSPEEDSCALE

            jsonData = {'lat':GPSData.lat,
                        'lon':GPSData.lon,
                        'altitude':GPSData.altitude,
                        'speed':GPSData.speed,
                        'time':GPSData.time,
                        'satellites':GPSData.satellites,
                        'date':GPSData.date}
            # print(jsonData)
            socketio.emit('GPSChannel',jsonData)
            socketio.emit('connectStatus','Connected')

            databaseObj = databasehelperclass.gpsvaluetable(float(GPSData.lat),float(GPSData.lon),float(GPSData.speed),
                float(GPSData.satellites),float(GPSData.altitude),float(GPSData.time),
                int(GPSData.date),1,point)
            databaseinsertion(databaseObj)

        if EnviroData is not None:
            EnviroData.humidity = EnviroData.humidity / ENVIROSCALE
            EnviroData.pressure = EnviroData.pressure / ENVIROSCALE
            EnviroData.temperature = EnviroData.temperature / ENVIROSCALE

            jsonData = {'pressure':EnviroData.pressure,
                        'humidity':EnviroData.humidity,
                        'temperature':EnviroData.temperature}
            # print(jsonData)
            socketio.emit('EnviroChannel',jsonData)
            socketio.emit('connectStatus','Connected')

            print(EnviroData)

            databaseObj = databasehelperclass.environmentalsensortable(float(EnviroData.pressure),
                float(EnviroData.humidity),
                float(EnviroData.temperature),
                1,point)
            databaseinsertion(databaseObj)

        if BatteryData is not None:
            jsonData = {'voltage':BatteryData.voltage,
                        'current':BatteryData.current}
            # print(jsonData)
            socketio.emit('BatteryChannel',jsonData)
            socketio.emit('connectStatus','Connected')

            databaseObj = databasehelperclass.batterystatustable(float(BatteryData.voltage),
                float(BatteryData.current),
                1,point)
            databaseinsertion(databaseObj)

        if StatusData is not None:
            jsonData = {'rrsi':StatusData.rssi,
                        'state':StatusData.state}
            # print(jsonData)
            socketio.emit('StatusChannel',jsonData)
            socketio.emit('connectStatus','Connected')

            databaseObj = databasehelperclass.systemstatustable(float(StatusData.rssi),
                float(StatusData.state),
                1,point)
            databaseinsertion(databaseObj)

        if ServoData is not None:
            jsonData = {'servo0':ServoData.servo0,
                        'servo1':ServoData.servo1,
                        'servo2':ServoData.servo2,
                        'servo3':ServoData.servo3,
                        'servo4':ServoData.servo4,
                        'servo5':ServoData.servo5,
                        'servo6':ServoData.servo6,
                        'servo7':ServoData.servo7,
                        'servo8':ServoData.servo8,
                        'servo9':ServoData.servo9,
                        'servo10':ServoData.servo10,
                        'servo11':ServoData.servo11,
                        'servo12':ServoData.servo12,
                        'servo13':ServoData.servo13,
                        'servo14':ServoData.servo14,
                        'servo15':ServoData.servo15}
            # print(jsonData)
            socketio.emit('ServoChannel',jsonData)
            socketio.emit('connectStatus','Connected')

            databaseObj = databasehelperclass.servodatatable(float(ServoData.servo0),
                float(ServoData.servo1),
                float(ServoData.servo2),
                float(ServoData.servo3),
                float(ServoData.servo4),
                float(ServoData.servo5),
                float(ServoData.servo6),
                float(ServoData.servo7),
                float(ServoData.servo8),
                float(ServoData.servo9),
                float(ServoData.servo10),
                float(ServoData.servo11),
                float(ServoData.servo12),
                float(ServoData.servo13),
                float(ServoData.servo14),
                float(ServoData.servo15),
                1,point)
            databaseinsertion(databaseObj)

    #time.sleep(0.1)
    # The plan is here to take data that is parsed from the serial port and add it to the DB

# Event handler that is called before a write. should return a message to send over serial or None
def pre_serial_write(app,data = None):
    print('Serial write data gather')
    global serialDataOut

    builder = MessageBuilder()

    c = Commands()
    c.drop = serialDataOut.cmdDrop
    c.servos = serialDataOut.cmdServo
    c.pitch = serialDataOut.cmdPitch

    builder.add(c)

    #i = IMU()
    #i.ax = 10

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
    # builder.add(i)
    # builder.add(e)

    write_val = builder.build(0,serialDataOut.destination)
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