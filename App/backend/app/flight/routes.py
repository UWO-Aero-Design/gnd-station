from app.flight import api

import time
import json
from collections import defaultdict

from flask import render_template, jsonify, request, current_app, session
from app import serial
from app.serial import events

from app import database
from app.database import databasehelperclass,queryDatabase
from app.database import queryDatabase

from .. import dbase

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

    databaseObj = databasehelperclass.flightpathtable(currentState.flight,'Person','Florida','Plane','1','1','2','2')
    databaseinsertion(databaseObj)

    currentState.point = 0

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

    altitudes = [0]

    for i,point in enumerate(flight):
        altitudes.append(point[5])

    print(altitudes)

    return json.dumps(altitudes), 202

@api.route('/flightlats', methods=['GET'])
def flightlats():
    flightID = request.args.get('flightID')
    print(flightID)
    query = queryDatabase.QueryDatabase(flightID)

    flight =  query.getGPSValuesForFlight()

    latitudes = [0]

    for i,point in enumerate(flight):
        latitudes.append(point[1])

    print(latitudes)

    return json.dumps(latitudes), 202

@api.route('/flightlons', methods=['GET'])
def flightlons():
    flightID = request.args.get('flightID')
    print(flightID)
    query = queryDatabase.QueryDatabase(flightID)

    flight =  query.getGPSValuesForFlight()

    longitudes = [0]

    for i,point in enumerate(flight):
        longitudes.append(point[2])

    print(longitudes)

    return json.dumps(longitudes), 202

def databaseinsertion(obj):
    #databasehelperclass.db.session.add(obj)
    #databasehelperclass.db.session.commit()

    dbase.session.add(obj)
    dbase.session.commit()