#API endpoints for fpv view

from flask import Blueprint

api = Blueprint('fpv',__name__)

from app.fpv import routes