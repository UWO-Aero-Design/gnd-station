#API endpoints for communication view

from flask import Blueprint
from flask_cors import CORS

api = Blueprint('communication',__name__)

from app.communication import routes