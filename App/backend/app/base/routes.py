from app.base import api
import threading
import time
import redis
from rq import Queue,Connection
from flask import render_template, jsonify, request, current_app, session
from app import serial
from app.serial import connection

from flask import current_app as app

from app import database
from app.database import databasehelperclass
from app.database import queryDatabase

from .. import dbase
from .. import currentState

import requests

#Serve vue app
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    #if app.debug:
    #    return requests.get('http://localhost:8080/{}'.format(path)).text
    return render_template("index.html")

#Test Ping
@api.route('/ping')
def ping():
    return jsonify({'status':'pong'})

""" @api.route('/readdata')
def readdata():
    with Connection(redis.from_url(current_app.config['REDIS_URL'])):
        q = Queue()
        task = q.enqueue(create_task)
    response_object = {
        'status': 'success',
        'data': {
            'task_id': task.get_id()\
        }
    }
    return jsonify(response_object), 202 """

@api.before_app_first_request
def activate_job():
    #Database setup
    flightid = 1
    locationid = 1
    planeid = 1
    planeversion = 1
    gliderid = 1
    gliderversion = 1
    pilotname = "Asim"
    airplanetype = "Plane"
    
    #Clear previous data
    databasehelperclass.planetable.query.delete()
    databasehelperclass.glidertable.query.delete()
    databasehelperclass.flightpathtable.query.delete()
    databasehelperclass.pointtable.query.delete()
    databasehelperclass.gpsvaluetable.query.delete()
    databasehelperclass.imuvaluestable.query.delete()
    databasehelperclass.environmentalsensortable.query.delete()
    databasehelperclass.batterystatustable.query.delete()
    databasehelperclass.systemstatustable.query.delete()
    databasehelperclass.servodatatable.query.delete()
    databasehelperclass.pitottubetable.query.delete()
    dbase.session.commit()

    databaseObj = databasehelperclass.planetable(planeid,planeversion)
    databaseinsertion(databaseObj)

    databaseObj = databasehelperclass.glidertable(gliderid,gliderversion)
    databaseinsertion(databaseObj)

    databaseObj = databasehelperclass.flightpathtable(flightid,pilotname,locationid,airplanetype,planeid,planeversion,gliderid,gliderversion)
    databaseinsertion(databaseObj)

    flightQueryObj = queryDatabase.QueryDatabase(1)

    currentState.flight = flightQueryObj.getRecentFlightPath()[0][0]

    print(currentState.flight)

    #Start background serial thread
    thread = threading.Thread(target=serial.connection.serial_data, args=[current_app._get_current_object()])
    thread.start()

def databaseinsertion(obj):
    #databasehelperclass.db.session.add(obj)
    #databasehelperclass.db.session.commit()

    dbase.session.add(obj)
    dbase.session.commit()