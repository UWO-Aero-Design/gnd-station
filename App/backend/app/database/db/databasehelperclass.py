#from sqlalchemy import create_engine
#from sqlalchemy.orm import scoped_session, sessionmaker
#from sqlalchemy.ext.declarative import declarative_base
from flask_sqlalchemy import SQLAlchemy

from .. import dbase

#creating class that mirrors each table in Aerodbase.dbase
class planetable(dbase.Model):
        __tablename__='Plane'
        PlaneID = dbase.Column('PlaneID',dbase.Integer,primary_key=True)
        PlaneVersion = dbase.Column('PlaneVersion',dbase.Integer,primary_key = True)

        def __init__(self,planeid,planeversion):
            self.PlaneID =planeid
            self.PlaneVersion = planeversion

class glidertable(dbase.Model):
        __tablename__='Glider'
        GliderID = dbase.Column('GliderID',dbase.Integer,primary_key = True)
        GliderVersion = dbase.Column('GliderVersion',dbase.Integer,primary_key = True)

        def __init__(self,gliderid,gliderversion):
            self.GliderID =gliderid
            self.GliderVersion = gliderversion

class flightpathtable(dbase.Model):
    __tablename__='FlightPath'
    FlightPathID= dbase.Column('FlightPathID',dbase.Integer,primary_key = True)
    PilotName = dbase.Column('PilotName',dbase.Text)
    LocationID = dbase.Column('LocationID',dbase.Integer)
    AirplaneType = dbase.Column('AirplaneType',dbase.Text)
    PlaneID = dbase.Column('PlaneID',dbase.Integer)
    PlaneVersion = dbase.Column('PlaneVersion',dbase.Integer)
    GliderID = dbase.Column('GliderID',dbase.Integer)
    GliderVersion = dbase.Column('GliderVersion',dbase.Integer)

    def __init__(self,flightpathid,pilotname,locationid,airplanetype,planeid,planeversion,gliderid,gliderversion):
        self.FlightPathID = flightpathid
        self.PilotName = pilotname
        self.LocationID = locationid
        self.AirplaneType = airplanetype
        self.PlaneID = planeid
        self.PlaneVersion = planeversion
        self.GliderID = gliderid
        self.GliderVersion = gliderversion

class pointtable(dbase.Model):
        __tablename__ = 'Point'
        FlightPathID = dbase.Column('FlightPathID',dbase.Integer,primary_key = True)
        PointID = dbase.Column('PointID',dbase.Integer,primary_key = True)

        def __init__(self,flightpathid,pointid):
            self.FlightPathID = flightpathid
            self.PointID = pointid

class gpsvaluetable(dbase.Model):
    __tablename__ = 'GpsValue'
    Latitude = db.Column('Latitude',db.Float)
    Longitude = db.Column('Longitude',db.Float)
    Speed = db.Column('Speed',db.Float)
    Satellite = db.Column('Satellite',db.Integer)
    Altitude = db.Column('Altitude',db.Float)
    GPSTime = db.Column('GPSTime',db.BigInteger)
    GPSDate = db.Column('GPSDate',db.BigInteger)
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

class imuvaluestable(dbase.Model):
    __tablename__ = 'ImuValues'
    AccelerometerX = dbase.Column('AccelerometerX',dbase.Float)
    AccelerometerY = dbase.Column('AccelerometerY',dbase.Float)
    AccelerometerZ = dbase.Column('AccelerometerZ',dbase.Float)
    Yaw = dbase.Column('Yaw',dbase.Float)
    Pitch = dbase.Column('Pitch',dbase.Float)
    Roll = dbase.Column('Roll',dbase.Float)
    MagnetometerX = dbase.Column('MagnetometerX',dbase.Float)
    MagnetometerY = dbase.Column('MagnetometerY',dbase.Float)
    MagnetometerZ = dbase.Column('MagnetometerZ',dbase.Float)
    GyroscopeX = dbase.Column('GyroscopeX',dbase.Float)
    GyroscopeY = dbase.Column('GyroscopeY',dbase.Float)
    GyroscopeZ = dbase.Column('GyroscopeZ',dbase.Float)
    FlightPathID = dbase.Column('FlightPathID',dbase.Integer, primary_key = True)
    PointID = dbase.Column('PointID',dbase.Integer, primary_key = True)

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


class environmentalsensortable(dbase.Model):
    __tablename__ = 'EnvironmentalSensorData'
    Pressure = db.Column('Pressure',db.Float)
    Humidity = db.Column('Humidity',db.Float)
    Temperature = db.Column('Temperature',db.Float)
    BatteryVoltage = db.Column('BatteryVoltage',db.Float)
    BatteryCurrent = db.Column('BatteryCurrent',db.Float)
    FlightPathID = db.Column('FlightPathID',db.Integer, primary_key = True)
    PointID = db.Column('PointID',db.Integer, primary_key = True)

    def __init__(self,pressure,humidity,temperature,batteryvoltage,batterycurrent,flightpathid,pointid):
        self.Pressure = pressure 
        self.Humidity = humidity 
        self.Temperature = temperature 
        self.BatteryVoltage = batteryvoltage
        self.BatteryCurrent = batterycurrent
        self.FlightPathID = flightpathid 
        self.PointID = pointid 
    
    @property
    def serialize(self):
        return{
            'Pressure': self.Pressure,
            'Humidity': self.Humidity,
            'Temperature':self.Temperature,
            'BatteryVoltage':self.BatteryVoltage,
            'BatteryCurrent':self.BatteryCurrent,
            'FlightPathID':self.FlightPathID,
            'PointID':self.Point
        }

class batterystatustable(dbase.Model):
    __tablename__ = 'BatteryStatus'
    BatteryVoltage = db.Column('BatteryVoltage',db.Float)
    BatteryCurrent = db.Column('BatteryCurrent',db.Float)
    Rssi = db.Column('Rssi',db.Float)
    FlightPathID = db.Column('FlightPathID',db.Integer, primary_key = True)
    PointID = db.Column('PointID',db.Integer, primary_key = True)
    
    def __init__ (self,voltage, current,rssi, flightpathid, pointid):
        self.BatteryVoltage = voltage 
        self.BatteryCurrent = current
        self.Rssi = rssi
        self.FlightPathID = flightpathid 
        self.PointID = pointid 
    @property
    def serialize(self):
        return{
            'BatteryVoltage':self.BatteryVoltage,
            'BatteryCurrent':self.BatteryCurrent,
            'Rssi':self.Rssi,
            'FlightPathID':self.FlightPathID,
            'PointID':self.PointID
        }

class systemstatustable(dbase.Model):
    __tablename__ = 'SystemStatus'
    Rssi = db.Column('Rssi',db.BigInteger)
    State =   db.Column('State',db.Float)
    FlightPathID = db.Column('FlightPathID',db.Integer,primary_key = True)
    PointID = db.Column('PointID', db.Integer, primary_key = True)

    def __init__ (self,rssi,state,flightpathid,pointid):
        self.Rssi = rssi 
        self.State = state 
        self.FlightPathID = flightpathid 
        self.PointID = pointid

class servodatatable(dbase.Model):
    __tablename__ = 'ServoData'
    Servo0 = db.Column('Servo0',db.BigInteger)
    Servo1 = db.Column('Servo1',db.BigInteger)
    Servo2 = db.Column('Servo2',db.BigInteger)
    Servo3 = db.Column('Servo3',db.BigInteger)
    Servo4 = db.Column('Servo4',db.BigInteger)
    Servo5 = db.Column('Servo5',db.BigInteger)
    Servo6 = db.Column('Servo6',db.BigInteger)
    Servo7 = db.Column('Servo7',db.BigInteger)
    Servo8 = db.Column('Servo8',db.BigInteger)
    Servo9 = db.Column('Servo9',db.BigInteger)
    Servo10 = db.Column('Servo10',db.BigInteger)
    Servo11 = db.Column('Servo11',db.BigInteger)
    Servo12 = db.Column('Servo12',db.BigInteger)
    Servo13 = db.Column('Servo13',db.BigInteger)
    Servo14 = db.Column('Servo14',db.BigInteger)
    Servo15 = db.Column('Servo15',db.BigInteger)
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

class pitottubetable(db.Model):
    __tablename__ = 'PitotTubeData'
    DiffPressure = db.Column('DiffPressure',db.Float)
    FlightPathID = db.Column('FlightPathID',db.Integer,primary_key = True)
    PointID = db.Column('PointID', db.Integer, primary_key = True)

    def __init__ (self,diffpressure,flightpathid,pointid):
        self.DiffPressure = diffpressure
        self.FlightPathID = flightpathid 
        self.PointID = pointid

    @property
    def serialize(self):
        return{
            'DiffPressure':self.DiffPressure,
            'FlightPathID':self.FlightPathID,
            'PointID':self.PointID
        }  

class commandstable(db.Model):
    __tablename__ = 'Commands'
    DropLoad = db.Column('DropLoad',db.BigInteger)
    Servo0 = db.Column('Servo0',db.BigInteger)
    Servo1 = db.Column('Servo1',db.BigInteger)
    Servo2 = db.Column('Servo2',db.BigInteger)
    Servo3 = db.Column('Servo3',db.BigInteger)
    Servo4 = db.Column('Servo4',db.BigInteger)
    Servo5 = db.Column('Servo5',db.BigInteger)
    Servo6 = db.Column('Servo6',db.BigInteger)
    Servo7 = db.Column('Servo7',db.BigInteger)
    Servo8 = db.Column('Servo8',db.BigInteger)
    Servo9 = db.Column('Servo9',db.BigInteger)
    Servo10 = db.Column('Servo10',db.BigInteger)
    Servo11 = db.Column('Servo11',db.BigInteger)
    Servo12 = db.Column('Servo12',db.BigInteger)
    Servo13 = db.Column('Servo13',db.BigInteger)
    Servo14 = db.Column('Servo14',db.BigInteger)
    Servo15 = db.Column('Servo15',db.BigInteger)
    Pitch = db.Column('Pitch',db.Float)
    FlightPathID = db.Column('FlightPathID',db.Integer,primary_key = True)
    PointID = db.Column('PointID', db.Integer, primary_key = True)

    def __init__ (self,dropload,servo0, servo1, servo2, servo3, servo4, servo5, servo6, servo7, servo8, servo9, servo10, servo11, servo12, servo13, servo14, servo15,pitch, flightpathid,pointid):
        self.DropLoad = dropload
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
        self.Pitch = pitch
        self.FlightPathID = flightpathid 
        self.PointID = pointid

    @property
    def serialize(self):
        return{
            'DropLoad':self.DropLoad,
            'Servo0':self.Servo0,
            'Servo1':self.Servo1,
            'Servo2':self.Servo2,
            'Servo3':self.Servo3,
            'Servo4':self.Servo4,
            'Servo5':self.Servo5,
            'Servo6':self.Servo6,
            'Servo7':self.Servo7,
            'Servo8':self.Servo8,
            'Servo9':self.Servo9,
            'Servo10':self.Servo10,
            'Servo11':self.Servo11,
            'Servo12':self.Servo12,
            'Servo13':self.Servo13,
            'Servo14':self.Servo14,
            'Servo15':self.Servo15,
            'Pitch':self.Pitch,
            'FlightPathID':self.FlightPathID,
            'PointID':self.PointID
        }    