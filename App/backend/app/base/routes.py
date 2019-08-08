from app.base import api

@api.route('/')
def index():
    return "Hello"

@api.route('/Ping')
def ping():
    return "Connected"