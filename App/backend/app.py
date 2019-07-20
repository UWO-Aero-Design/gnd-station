from flask import Flask, render_template
import os
import socket
import redis
import time
import sqlite3

app = Flask(__name__, static_url_path='/assets/Icons')
DATABASE_PATH = '/database/database.sqlite3'
cache = redis.Redis(host='redis',port=6379)

#Database Connection
def db_connect(path=DATABASE_PATH):
    connection = sqlite3.connect(path)
    return connection

#Testing redis cache
def get_hit_count():
    retries = 5
    while True:
        try:
            return cache.incr('hits')
        except redis.exceptions.ConnectionError as exc:
            if retries == 0:
                raise exc
            retries -= 1
            time.sleep(0.5)

@app.route("/")
def home():
    count = get_hit_count()
    return render_template('index.html', hits=count)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)