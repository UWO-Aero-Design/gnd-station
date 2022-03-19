#API endpoints for base view

from flask import Blueprint

api = Blueprint('base',__name__)

from app.base import routes