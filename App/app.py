from flask import Flask, render_template
import os
import socket

app = Flask(__name__, static_url_path='/assets/Icons')

@app.route("/")
def home():
    #hello
    return render_template('index.html')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)
