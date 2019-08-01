from app.base import api

@api.route('/')
def index():
    return "Hello"