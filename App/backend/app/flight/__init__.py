#API endpoints for flight view

from flask import Blueprint

api = Blueprint('flight',__name__)

from app.flight import routes