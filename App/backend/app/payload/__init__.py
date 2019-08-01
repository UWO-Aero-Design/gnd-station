#API endpoints for payload view

from flask import Blueprint

api = Blueprint('payload',__name__)

from app.payload import routes