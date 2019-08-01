#Application Factory

#Imports
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import BaseConfig

def create_app(config_class=BaseConfig):
    app = Flask(__name__)
    app.config.from_object(config_class)

    #Register Blueprints
    from app.base import api as base_bp
    app.register_blueprint(base_bp)

    from app.communication import api as communication_bp
    app.register_blueprint(communication_bp, url_prefix='/communication')

    from app.error import api as error_bp
    app.register_blueprint(error_bp, url_prefix='/error')

    from app.flight import api as flight_bp
    app.register_blueprint(flight_bp, url_prefix='/flight')

    from app.fpv import api as fpv_bp
    app.register_blueprint(fpv_bp, url_prefix='/fpv')

    from app.info import api as info_bp
    app.register_blueprint(info_bp, url_prefix='/info')

    from app.map import api as map_bp
    app.register_blueprint(map_bp, url_prefix='/map')

    from app.payload import api as payload_bp
    app.register_blueprint(payload_bp, url_prefix='/payload')

    from app.status import api as status_bp
    app.register_blueprint(status_bp, url_prefix='/status')

    return app