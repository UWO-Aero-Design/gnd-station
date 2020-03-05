from app.flight import api
import time
from flask import render_template, jsonify, request, current_app, session
from app import serial
from app.serial import events

from app import database
from app.database import databasehelperclass,queryDatabase
from app.database import queryDatabase

from .. import currentState
from .. import recordingEvent

from flask_cors import cross_origin
from .. import serialDataIn
from .. import currentState


@api.route('/start', methods=['GET'])
def startRecording():

    global currentState
    global recordingEvent

    currentState.recording = True
    currentState.flight = currentState.flight + 1
    currentState.point = 0

    print(currentState.recording)

    return "Started", 202

@api.route('/stop', methods=['GET'])
def stopRecording():
    global currentState
    global recordingEvent
    currentState.recording = False

    print(currentState.recording)

    return "Stopped", 202

@api.route('/getflight', methods=['GET'])
def returnFlight():
    flightID = request.args.get('flightID')
    print(flightID)
    database = queryDatabase.QueryDatabase(flightID)

    flight =  database.getGPSValuesForFlight()

    print(flight)

    return "OK", 202