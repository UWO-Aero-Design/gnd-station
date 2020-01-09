#Configuration settings for flask application instances
import os

class BaseConfig(object):
    #Currently using in memory database
    SQLALCHEMY_DATABASE_URI = 'sqlite://'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'secretkey'
    REDIS_URL = redis_url = os.getenv('REDISTOGO_URL', 'redis://redis:6379')