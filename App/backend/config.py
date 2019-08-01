#Configuration settings for flask application instances

class BaseConfig(object):
    #Currently using in memory database
    SQLALCHEMY_DATABASE_URI = 'sqlite://'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'secretkey'