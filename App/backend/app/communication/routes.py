from app.communication import api
import time
from flask import render_template, jsonify, request, current_app, session
from app import serial
from app.serial import events

from app import database
from app.database import databasehelperclass,queryDatabase

from .. import dbase

from .. import serialWriteEvent

from flask_cors import cross_origin
from .. import serialDataOut
from .. import currentState
from .. import serialDataIn
from .. import socketio

@api.route('/sendcmd', methods=['POST'])
def sendCMD():
    if not request.json:
        return 'Command wrong format'

    #print("Command Received")

    commands = request.json['body']

    #flightID = commands['flightID']
    #point = commands['point']

    #Extra place at front for no command
    dropString = [0,0,0,0,0,0]
    pitchString = [0,0,0,0,0,0,0]
    servoString = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

    #Negative index for reverse order
    dropString[-int(commands['drop'])] = 1
    pitchString[-int(commands['pitch'])] = 1
    servoString[-int(commands['servo'])] = 1

    #Convert list to string of bits
    drop = ''.join(map(str,dropString))
    pitch = ''.join(map(str,pitchString))
    servo = ''.join(map(str,servoString))

    #Remove first element
    drop = int(drop[1:],base=2)
    pitch = int(pitch[1:],base=2)
    servo = int(servo[1:],base=2)

    print("Bitfield")
    #print(dropString)
    #print(pitchString)
    #print(servoString)

    #print("Integer Conversion")
    #print(drop)
    #print(pitch)
    #print(servo)

    global serialDataOut

    serialDataOut.cmdDrop = drop
    serialDataOut.cmdServo = servo
    serialDataOut.cmdPitch = pitch
    serialDataOut.destination = int(commands['destination'])

    #print("Going to",commands['destination'])

    # databaseObj = queryDatabase.QueryDatabase(flightID)
    # serialDataOut.IMU = databaseObj.getIMUValuesForFlightPoint(point)
    # serialDataOut.GPS = databaseObj.getGPSValuesForFlightPoint(point)
    # serialDataOut.Env = databaseObj.getEnvironmentalSensorValuesForFlightPoint(point)
    # serialDataOut.Battery = databaseObj.getBatteryStatusValuesForFlightPoint(point)
    # serialDataOut.System = databaseObj.getSystemStatusValuesForFlightPoint(point)
    # serialDataOut.Servo = databaseObj.getServoDataValuesForFlightPoint(point)

    global serialDataIn

    if serialDataIn.EnviroData is not None and serialDataIn.GPSData is not None:
        if dropString[-3] and currentState.gliderdropped is False:
            currentState.gliderdropped = True
            jsonData = {'payload':'glider','altitude': serialDataIn.EnviroData.pressure}
            #jsonData = {'payload':'water',
             #           'altitude': 23}
            #print(jsonData)
            socketio.emit('PayloadChannel',jsonData)
            databaseObj = databasehelperclass.dropdatatable(1,currentState.flight,currentState.point,serialDataIn.EnviroData.pressure,serialDataIn.GPSData.lat,serialDataIn.GPSData.lon)
            databaseinsertion(databaseObj)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
        elif dropString[-4] and currentState.payloaddropped is False:
            currentState.payloaddropped = True
            jsonData = {'payload':'water','altitude': serialDataIn.EnviroData.pressure}
            # print(jsonData)
            socketio.emit('PayloadChannel',jsonData)
            databaseObj = databasehelperclass.dropdatatable(2,currentState.flight,currentState.point,serialDataIn.EnviroData.pressure,serialDataIn.GPSData.lat,serialDataIn.GPSData.lon)
            databaseinsertion(databaseObj)
            jsonData = {'payload':'habitat','altitude': serialDataIn.EnviroData.pressure}
            print(jsonData)
            socketio.emit('PayloadChannel',jsonData)
            # databaseObj = databasehelperclass.dropdatatable(3,currentState.flight,currentState.point,serialDataIn.EnviroData.pressure,serialDataIn.GPSData.lat,serialDataIn.GPSData.lon)
            # databaseinsertion(databaseObj)


        # elif dropString[-5] and currentState.payloaddropped is False:
        #     currentState.payloaddropped = True
        #     jsonData = {'payload':'habitat','altitude': serialDataIn.EnviroData.pressure}
        #     # print(jsonData)
        #     socketio.emit('PayloadChannel',jsonData)
        #     databaseObj = databasehelperclass.dropdatatable(3,currentState.flight,currentState.point,serialDataIn.EnviroData.pressure,serialDataIn.GPSData.lat,serialDataIn.GPSData.lon)
        #     databaseinsertion(databaseObj)

    
    global serialWriteEvent
    serialWriteEvent.set()
    print("Data request set")

    response_object = {
        'drop': commands['drop'],
        'servo': commands['servo'],
        'pitch': commands['pitch'],
        'point': commands['point'],
        'flightID': commands['flightID']
    }

    return jsonify(response_object), 202

def databaseinsertion(obj):
    #databasehelperclass.db.session.add(obj)
    #databasehelperclass.db.session.commit()

    dbase.session.add(obj)
    dbase.session.commit()