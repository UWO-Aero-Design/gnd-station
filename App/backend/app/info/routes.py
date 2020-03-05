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
from .. import socketio

@api.route('/drop', methods=['POST'])
def activateDrop():
    if not request.json:
        return 'Command wrong format'

    print("Drop Activated")

    drop = request.json['body']

    global serialDataIn

    if serialDataIn.EnviroData is not None:
        response_object = {
            'Altitude': serialDataIn.EnviroData.pressure
        }
    else:
        response_object = {
            'Altitude': -1
        }

    print(response_object)

    return jsonify(response_object), 202

@api.route('/dropreset', methods=['GET'])
def resetDrop():

    print("Drop Reset")


    global serialDataIn

    jsonData = {'payload':'water','altitude': 0}
    #jsonData = {'payload':'water',
        #           'altitude': 23}
    #print(jsonData)
    socketio.emit('PayloadChannel',jsonData)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
    jsonData = {'payload':'habitat1','altitude': 0}
    # print(jsonData)
    socketio.emit('PayloadChannel',jsonData)

    jsonData = {'payload':'habitat2','altitude': 0}
    # print(jsonData)
    socketio.emit('PayloadChannel',jsonData)

    return "Reset", 202