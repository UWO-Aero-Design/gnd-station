from app.flight import api

import time
from collections import defaultdict

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

@api.route('/flightpaths',methods=['GET'])
def flightpaths():
    query = queryDatabase.QueryDatabase(1)
    flightPaths = query.getFlightPathInfo()

    print(flightPaths)

    jsonFlightPaths = defaultdict(list)

    for element in flightPaths:
        jsonFlightPaths[element[0]].append({'PilotName': element[1], 'LocationID': element[2], 
        'AirplaneType': element[3], 'PlaneID': element[4],'PlaneVersion': element[5],'GliderID': element[6],'GliderVersion': element[7]})

    print(jsonFlightPaths)

    return dict(jsonFlightPaths),202

@api.route('/flights', methods=['GET'])
def flights():
    flightID = request.args.get('flightID')
    print(flightID)
    query = queryDatabase.QueryDatabase(flightID)

    flight =  query.getGPSValuesForFlight()

    print(flight)

    return "OK", 202