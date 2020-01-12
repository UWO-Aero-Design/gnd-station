#Configuration settings for flask application instances
import os

class BaseConfig(object):
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = 'sqlite:///C:\Aero\gnd-station\db\Aerodb.db'
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'secretkey'
    REDIS_URL = redis_url = os.getenv('REDISTOGO_URL', 'redis://redis:6379')