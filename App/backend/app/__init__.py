#Application Factory

#Imports
from flask import Flask
from config import BaseConfig
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import BaseConfig
from flask_cors import CORS
from flask_socketio import SocketIO
from redis import Redis
import rq

from flask import Flask
from flask_sqlalchemy import SQLAlchemy

#Flask extensions
socketio = SocketIO()
dbase = SQLAlchemy()

#def create_app(config_class=BaseConfig):
def create_app(debug=False):
    app = Flask(__name__)
    app.config.from_object(BaseConfig)
    app.debug = debug

    #Initialize flask extensions
    cors = CORS(app) #Cors not usable for now
    
    dbase.init_app(app)
    socketio.init_app(app,cors_allowed_origins="*")

    #app.redis = Redis.from_url(app.config['REDIS_URL'])
    #app.task_queue = rq.Queue('serial', connection=app.redis)

    with app.app_context():
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