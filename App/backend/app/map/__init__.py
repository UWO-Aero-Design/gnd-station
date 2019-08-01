#API endpoints for base view

from flask import Blueprint

api = Blueprint('map',__name__)

from app.map import routes