from app.communication import api
import time
from flask import render_template, jsonify, request, current_app, session
from app import Serial
from app.Serial import events

from app import database
from app.database import databasehelperclass,queryDatabase

from .. import serialWriteEvent
from .. import serialDataOut

@api.route('/sendcmd', methods=['POST'])
def sendCMD():
    if not request.json:
        return 'Command wrong format'

    flightID = request.json['flightID']
    point = request.json['point']

    global serialDataOut

    serialDataOut.cmdDrop = request.json['drop']
    serialDataOut.cmdServo = request.json['servo']
    serialDataOut.cmdPitch = request.json['pitch']

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
        'drop': request.json['drop'],
        'servo': request.json['servo'],
        'pitch': request.json['pitch'],
        'point': request.json['point'],
        'flightID': request.json['flightID']
    }

    return jsonify(response_object), 202