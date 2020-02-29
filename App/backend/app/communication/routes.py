from app.communication import api
import time
from flask import render_template, jsonify, request, current_app, session
from app import Serial
from app.Serial import events

from app import database
from app.database import databasehelperclass,queryDatabase

from .. import serialWriteEvent

from flask_cors import cross_origin
from .. import serialDataOut

@api.route('/sendcmd', methods=['POST'])
def sendCMD():
    if not request.json:
        return 'Command wrong format'

    print("Command Sent")

    commands = request.json['body']

    flightID = commands['flightID']
    point = commands['point']

    global serialDataOut

    serialDataOut.cmdDrop = commands['drop']
    serialDataOut.cmdServo = commands['servo']
    serialDataOut.cmdPitch = commands['pitch']

    databaseObj = queryDatabase.QueryDatabase(flightID)
    serialDataOut.IMU = databaseObj.getIMUValuesForFlightPoint(point)
    serialDataOut.GPS = databaseObj.getGPSValuesForFlightPoint(point)
    serialDataOut.Env = databaseObj.getEnvironmentalSensorValuesForFlightPoint(point)
    serialDataOut.Battery = databaseObj.getBatteryStatusValuesForFlightPoint(point)
    serialDataOut.System = databaseObj.getSystemStatusValuesForFlightPoint(point)
    serialDataOut.Servo = databaseObj.getServoDataValuesForFlightPoint(point)

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