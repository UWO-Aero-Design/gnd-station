from app.communication import api
import time
from flask import render_template, jsonify, request, current_app, session
from app import Serial
from app.Serial import events

from app import database
from app.database import databasehelperclass

from .. import dbase

@api.route('/cmd')
def sendCMD():

    #Pass data for serial prep
    Serial.events.pre_serial_write('hello')
    return 'Data write request sent'