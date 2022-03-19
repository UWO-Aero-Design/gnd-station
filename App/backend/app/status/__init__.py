#API endpoints for status view

from flask import Blueprint

api = Blueprint('status',__name__)

from app.status import routes