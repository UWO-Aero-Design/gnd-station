#Application Factory

#Imports
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask-migrate import Migrate
from config import BaseConfig

def create_app(config_class=BaseConfig):
    app = Flask(__name__)
    app.config.from_object(config_class)

    #Register Blueprints
    from app.base import bp as base_bp
    app.register_blueprint(base_bp)

    return app