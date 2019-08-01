#API endpoints for communication view

from flask import Blueprint

api = Blueprint('communication',__name__)

from app.communication import routes