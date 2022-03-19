#API endpoints for error handling

from flask import Blueprint

api = Blueprint('error',__name__)

from app.error import handlers