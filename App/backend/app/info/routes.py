from app.info import api
import time
from flask import render_template, jsonify, request, current_app, session
from app import serial
from app.serial import events

from app import database
from app.database import databasehelperclass,queryDatabase

from .. import serialWriteEvent

from flask_cors import cross_origin
from .. import serialDataIn

@api.route('/drop', methods=['POST'])
def activateDrop():
    if not request.json:
        return 'Command wrong format'

    print("Drop Activated")

    drop = request.json['body']

    global serialDataIn

    response_object = {
        'Altitude': serialDataIn.GPSData.altitude
    }

    print(response_object)

    return jsonify(response_object), 202