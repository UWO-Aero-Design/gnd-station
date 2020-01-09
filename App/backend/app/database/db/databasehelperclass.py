#from sqlalchemy import create_engine
#from sqlalchemy.orm import scoped_session, sessionmaker
#from sqlalchemy.ext.declarative import declarative_base
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///C:\Aero\gnd-station\db\Aerodb.db'
db = SQLAlchemy(app)

#creating class that mirrors each table in Aerodb.db
class planetable(db.Model):
        __tablename__='Plane'
        PlaneID = db.Column('PlaneID',db.Integer,primary_key=True)
        PlaneVersion = db.Column('PlaneVersion',db.Integer,primary_key = True)

        def __init__(self,planeid,planeversion):
            self.PlaneID =planeid
            self.PlaneVersion = planeversion

class glidertable(db.Model):
        __tablename__='Glider'
        GliderID = db.Column('GliderID',db.Integer,primary_key = True)
        GliderVersion = db.Column('GliderVersion',db.Integer,primary_key = True)

        def __init__(self,gliderid,gliderversion):
            self.GliderID =gliderid
            self.GliderVersion = gliderversion

class flightpathtable(db.Model):
    __tablename__='FlightPath'
    FlightPathID= db.Column('FlightPathID',db.Integer,primary_key = True)
    PilotName = db.Column('PilotName',db.Text)
    LocationID = db.Column('LocationID',db.Integer)
    AirplaneType = db.Column('AirplaneType',db.Text)
    PlaneID = db.Column('PlaneID',db.Integer)
    PlaneVersion = db.Column('PlaneVersion',db.Integer)
    GliderID = db.Column('GliderID',db.Integer)
    GliderVersion = db.Column('GliderVersion',db.Integer)

    def __init__(self,flightpathid,pilotname,locationid,airplanetype,planeid,planeversion,gliderid,gliderversion):
        self.FlightPathID = flightpathid
        self.PilotName = pilotname
        self.LocationID = locationid
        self.AirplaneType = airplanetype
        self.PlaneID = planeid
        self.PlaneVersion = planeversion
        self.GliderID = gliderid
        self.GliderVersion = gliderversion

class pointtable(db.Model):
        __tablename__ = 'Point'
        FlightPathID = db.Column('FlightPathID',db.Integer,primary_key = True)
        PointID = db.Column('PointID',db.Integer,primary_key = True)

        def __init__(self,flightpathid,pointid):
            self.FlightPathID = flightpathid
            self.PointID = pointid

class gpsvaluetable(db.Model):
    __tablename__ = 'GpsValue'
    Latitude = db.Column('Latitude',db.Float)
    Longitude = db.Column('Longitude',db.Float)
    Speed = db.Column('Speed',db.Float)
    Satellite = db.Column('Satellite',db.Float)
    Altitude = db.Column('Altitude',db.Float)
    GPSTime = db.Column('GPSTime',db.Float)
    GPSDate = db.Column('GPSDate',db.Integer)
    FlightPathID = db.Column('FlightPathID',db.Integer,primary_key = True)
    PointID = db.Column('PointID',db.Integer,primary_key = True)

    def __init__(self,latitude,longitude,speed,satellite,altitude,time,date,flightpathid,pointid):
        self.Latitude = latitude
        self.Longitude = longitude 
        self.Speed = speed 
        self.Satellite = satellite
        self.Altitude = altitude 
        self.GPSTime = time 
        self.GPSDate = date 
        self.FlightPathID = flightpathid 
        self.PointID = pointid 

class imuvaluestable(db.Model):
    __tablename__ = 'ImuValues'
    AccelerometerX = db.Column('AccelerometerX',db.Float)
    AccelerometerY = db.Column('AccelerometerY',db.Float)
    AccelerometerZ = db.Column('AccelerometerZ',db.Float)
    Yaw = db.Column('Yaw',db.Float)
    Pitch = db.Column('Pitch',db.Float)
    Roll = db.Column('Roll',db.Float)
    MagnetometerX = db.Column('MagnetometerX',db.Float)
    MagnetometerY = db.Column('MagnetometerY',db.Float)
    MagnetometerZ = db.Column('MagnetometerZ',db.Float)
    GyroscopeX = db.Column('GyroscopeX',db.Float)
    GyroscopeY = db.Column('GyroscopeY',db.Float)
    GyroscopeZ = db.Column('GyroscopeZ',db.Float)
    FlightPathID = db.Column('FlightPathID',db.Integer, primary_key = True)
    PointID = db.Column('PointID',db.Integer, primary_key = True)

    def __init__(self,accelerometerx,accelerometery,accelerometerz,yaw,pitch,roll,magnetometerx,magnetometery,magnetometerz,gyroscopex,gyroscopey,gyroscopez,flightpathid,pointid):
        self.AccelerometerX = accelerometerx 
        self.AccelerometerY = accelerometery 
        self.AccelerometerZ = accelerometerz
        self.Yaw = yaw 
        self.Pitch = pitch 
        self.Roll = roll 
        self.MagnetometerX = magnetometerx 
        self.MagnetometerY = magnetometery 
        self.MagnetometerZ = magnetometerz 
        self.GyroscopeX = gyroscopex 
        self.GyroscopeY = gyroscopey 
        self.GyroscopeZ = gyroscopez 
        self.FlightPathID = flightpathid 
        self.PointID = pointid


class environmentalsensortable(db.Model):
    __tablename__ = 'EnvironmentalSensorData'
    Pressure = db.Column('Pressure',db.Float)
    Humidity = db.Column('Humidity',db.Float)
    Temperature = db.Column('Temperature',db.Float)
    FlightPathID = db.Column('FlightPathID',db.Integer, primary_key = True)
    PointID = db.Column('PointID',db.Integer, primary_key = True)

    def __init__(self,pressure,humidity,temperature,flightpathid,pointid):
        self.Pressure = pressure 
        self.Humidity = humidity 
        self.Temperature = temperature 
        self.FlightPathID = flightpathid 
        self.PointID = pointid 

class batterystatustable(db.Model):
    __tablename__ = 'BatteryStatus'
    BatteryVoltage = db.Column('BatteryVoltage',db.Float)
    BatteryCurrent = db.Column('BatteryCurrent',db.Float)
    FlightPathID = db.Column('FlightPathID',db.Integer, primary_key = True)
    PointID = db.Column('PointID',db.Integer, primary_key = True)
    
    def __init__ (self,voltage, current, flightpathid, pointid):
        self.BatteryVoltage = voltage 
        self.BatteryCurrent = current 
        self.FlightPathID = flightpathid 
        self.PointID = pointid 

class systemstatustable(db.Model):
    __tablename__ = 'SystemStatus'
    Rssi = db.Column('Rssi',db.Float)
    State =   db.Column('State',db.Float)
    FlightPathID = db.Column('FlightPathID',db.Integer,primary_key = True)
    PointID = db.Column('PointID', db.Integer, primary_key = True)

    def __init__ (self,rssi,state,flightpathid,pointid):
        self.Rssi = rssi 
        self.State = state 
        self.FlightPathID = flightpathid 
        self.PointID = pointid

class servodatatable(db.Model):
    __tablename__ = 'ServoData'
    Servo0 = db.Column('Servo0',db.Float)
    Servo1 = db.Column('Servo1',db.Float)
    Servo2 = db.Column('Servo2',db.Float)
    Servo3 = db.Column('Servo3',db.Float)
    Servo4 = db.Column('Servo4',db.Float)
    Servo5 = db.Column('Servo5',db.Float)
    Servo6 = db.Column('Servo6',db.Float)
    Servo7 = db.Column('Servo7',db.Float)
    Servo8 = db.Column('Servo8',db.Float)
    Servo9 = db.Column('Servo9',db.Float)
    Servo10 = db.Column('Servo10',db.Float)
    Servo11 = db.Column('Servo11',db.Float)
    Servo12 = db.Column('Servo12',db.Float)
    Servo13 = db.Column('Servo13',db.Float)
    Servo14 = db.Column('Servo14',db.Float)
    Servo15 = db.Column('Servo15',db.Float)
    FlightPathID = db.Column('FlightPathID',db.Integer, primary_key = True)
    PointID = db.Column('PointID',db.Integer, primary_key = True)

    def __init__ (self,servo0,servo1,servo2,servo3,servo4,servo5,servo6,servo7,servo8,servo9,servo10,servo11,servo12,servo13,servo14,servo15,flightpathid,pointid):
        self.Servo0 = servo0 
        self.Servo1 = servo1 
        self.Servo2 = servo2 
        self.Servo3 = servo3 
        self.Servo4 = servo4 
        self.Servo5 = servo5
        self.Servo6 = servo6 
        self.Servo7 = servo7 
        self.Servo8 = servo8 
        self.Servo9 = servo9 
        self.Servo10 = servo10 
        self.Servo11 = servo11 
        self.Servo12 = servo12 
        self.Servo13 = servo13 
        self.Servo14 = servo14 
        self.Servo15 = servo15 
        self.FlightPathID = flightpathid 
        self.PointID = pointid

        