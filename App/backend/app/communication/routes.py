from app.communication import api
import time
from flask import render_template, jsonify, request, current_app, session
from app import Serial
from app.Serial import events

from app import database
from app.database import databasehelperclass,queryDatabase

from .. import serialWriteEvent
from .. import serialDataOut

#TODO: Change to POST endpoint for variable commands
@api.route('/cmd/')
def sendCMD():
    point = 1
    flightID = 1
    databaseObj = queryDatabase.QueryDatabase(flightID)

    global serialDataOut

    serialDataOut.IMU = databaseObj.getIMUValuesForFlightPoint(point)
    serialDataOut.GPS = databaseObj.getGPSValuesForFlightPoint(point)
    serialDataOut.Env = databaseObj.getEnvironmentalSensorValuesForFlightPoint(point)
    serialDataOut.Battery = databaseObj.getBatteryStatusValuesForFlightPoint(point)
    serialDataOut.System = databaseObj.getSystemStatusValuesForFlightPoint(point)
    serialDataOut.Servo = databaseObj.getServoDataValuesForFlightPoint(point)

    serialDataOut.Cmd = 1

    global serialWriteEvent
    serialWriteEvent.set()
    print("Data request set")

    return 'Data write request sent'