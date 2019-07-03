from flask import Flask
import os
import socket

app = Flask(__name__)

@app.route("/")
def server():
    return 'Hello'

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)
