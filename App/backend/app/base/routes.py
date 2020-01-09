from app.base import api
import threading
import time
import redis
from rq import Queue,Connection
from flask import render_template, jsonify, request, current_app, session
from app import Serial
from app.Serial import connection

@api.route('/')
def index():
    return "Hello"

@api.route('/Ping')
def ping():
    return jsonify({'status':'ping'})

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
    thread = threading.Thread(target=Serial.connection.serial_data)
    thread.start()