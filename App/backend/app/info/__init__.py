#API endpoints for info view

from flask import Blueprint

api = Blueprint('info',__name__)

from app.info import routes