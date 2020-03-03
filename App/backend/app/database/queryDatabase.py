from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# this class connects to the database and performs queries.
# queries can be used to retrieve the entire data for a single flight, or
# queries can be used to retrieve data associated with a single point and flight. 
class QueryDatabase:

    # user specifies the current flight to request data from
    def __init__(self, flightNumberRequested):
        self.flightNumber = flightNumberRequested;

        self.app = Flask(__name__);
        #self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///C:\Aero\gnd-station\db\Aerodb.db';
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db/Aerodb.db';
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False;
        self.queryDatabase = SQLAlchemy(self.app);

    # returns a list of tuples(rows) which hold informations about each flight conducted
    # rows are in the following format:
    # (FlightPathID,PilotName,LocationID,AirplaneType,PlaneID,PlaneVersion,GliderID,GliderVersion)
    def getFlightPathInfo(self):
        query = 'SELECT * FROM FlightPath WHERE FlightPathID=' + str(self.flightNumber);
        return self.queryDatabase.session.execute(query).fetchall();

    # returns a list of tuples(rows) which hold informations about points recorded for a flight
    # rows are in the following format:
    # (PointID)
    def getPointInfoForFlight(self):
        query = 'SELECT PointID FROM Point WHERE FlightPathID='; 
        query += str(self.flightNumber) + ' ORDER BY PointID ASC';
        return self.queryDatabase.session.execute(query).fetchall();

    # returns a list of tuples(rows) which hold informations about GPS Values recorded for a flight
    # rows are in the following format:
    # (PointID, Latitude, Longitude, Speed, Satellite, Altitude, GPSTime, GPSDate)
    def getGPSValuesForFlight(self):
        query = 'SELECT PointID, Latitude, Longitude, Speed, Satellite, Altitude, GPSTime, GPSDate FROM GpsValue WHERE FlightPathID='; 
        query += str(self.flightNumber) + ' ORDER BY PointID ASC';
        return self.queryDatabase.session.execute(query).fetchall();

    # returns a list of tuples(rows) which hold informations about IMU Values recorded for a flight
    # rows are in the following format:
    # (PointID,AccelerometerX,AccelerometerY,AccelerometerZ,Yaw,Pitch,Roll,MagnetometerX,MagnetometerY,MagnetometerZ,GyroscopeX,GyroscopeY,GyroscopeZ)
    def getIMUValuesForFlight(self):
        query = 'SELECT PointID, AccelerometerX, AccelerometerY, AccelerometerZ,';
        query += ' Yaw, Pitch, Roll, MagnetometerX, MagnetometerY, MagnetometerZ';
        query += ' GyroscopeX, GyroscopeY, GyroscopeZ';
        query += ' FROM ImuValues WHERE FlightPathID=';
        query += str(self.flightNumber) + ' ORDER BY PointID ASC';
        return self.queryDatabase.session.execute(query).fetchall();

    # returns a list of tuples(rows) which hold informations about Environmental Sensor Values recorded for a flight
    # rows are in the following format:
    # (PointID, Pressure, Humidity, Temperature)
    def getEnvironmentalSensorForFlight(self):
        query = 'SELECT PointID, Pressure, Humidity, Temperature';
        query += ' FROM EnvironmentalSensorData WHERE FlightPathID=';
        query += str(self.flightNumber) + ' ORDER BY PointID ASC';
        return self.queryDatabase.session.execute(query).fetchall();

    # returns a list of tuples(rows) which hold informations about Battery Values recorded for a flight
    # rows are in the following format:
    # (PointID, BatteryVoltage, BatteryCurrent)
    def getBatteryStatusForFlight(self):
        query = 'SELECT PointID, BatteryVoltage, BatteryCurrent';
        query += ' FROM BatteryStatus WHERE FlightPathID=';
        query += str(self.flightNumber) + ' ORDER BY PointID ASC';
        return self.queryDatabase.session.execute(query).fetchall();

    # returns a list of tuples(rows) which hold informations about System Values (communication parameters?) recorded for a flight
    # rows are in the following format:
    # (PointID, Rssi, State)
    def getSystemStatusForFlight(self):
        query = 'SELECT PointID, Rssi, State';
        query += ' FROM SystemStatus WHERE FlightPathID=';
        query += str(self.flightNumber) + ' ORDER BY PointID ASC';
        return self.queryDatabase.session.execute(query).fetchall();

    # returns a list of tuples(rows) which hold informations about servo values recorded for a flight
    # rows are in the following format:
    # (PointID, Servo0, Servo1, Servo2, Servo3, Servo4, Servo5, Servo6, Servo7, Servo8, Servo9, Servo10, Servo11, Servo12, Servo13, Servo14, Servo15)
    def getServoDataForFlight(self):
        query = 'SELECT PointID, Servo0, Servo1, Servo2, Servo3, Servo4, Servo5, Servo6';
        query += ' Servo7, Servo8, Servo9, Servo10, Servo11, Servo12, Servo13, Servo14, Servo15';
        query += ' FROM ServoData WHERE FlightPathID=';
        query += str(self.flightNumber) + ' ORDER BY PointID ASC';
        return self.queryDatabase.session.execute(query).fetchall();

    # doing queries of individual points (query results are the same as above, but only one row is returned)
    # functions below require the specific point input as an additional paramter
    
    def getGPSValuesForFlightPoint(self, pointNumberRequested):
        query = 'SELECT Latitude, Longitude, Speed, Satellite, Altitude, GPSTime, GPSDate FROM GpsValue WHERE FlightPathID='; 
        query += str(self.flightNumber) + ' AND' + ' PointID=' + str(pointNumberRequested);
        return self.queryDatabase.session.execute(query).fetchall();

    def getIMUValuesForFlightPoint(self, pointNumberRequested):
        query = 'SELECT AccelerometerX, AccelerometerY, AccelerometerZ,';
        query += ' Yaw, Pitch, Roll, MagnetometerX, MagnetometerY, MagnetometerZ';
        query += ' GyroscopeX, GyroscopeY, GyroscopeZ';
        query += ' FROM ImuValues WHERE FlightPathID=';
        query += str(self.flightNumber) + ' AND' + ' PointID=' + str(pointNumberRequested);
        return self.queryDatabase.session.execute(query).fetchall();

    def getEnvironmentalSensorValuesForFlightPoint(self, pointNumberRequested):
        query = 'SELECT Pressure, Humidity, Temperature';
        query += ' FROM EnvironmentalSensorData WHERE FlightPathID=';
        query += str(self.flightNumber) + ' AND' + ' PointID=' + str(pointNumberRequested);
        return self.queryDatabase.session.execute(query).fetchall();

    def getBatteryStatusValuesForFlightPoint(self, pointNumberRequested):
        query = 'SELECT BatteryVoltage, BatteryCurrent';
        query += ' FROM BatteryStatus WHERE FlightPathID=';
        query += str(self.flightNumber) + ' AND' + ' PointID=' + str(pointNumberRequested);
        return self.queryDatabase.session.execute(query).fetchall();

    def getSystemStatusValuesForFlightPoint(self, pointNumberRequested):
        query = 'SELECT Rssi, State';
        query += ' FROM SystemStatus WHERE FlightPathID=';
        query += str(self.flightNumber) + ' AND' + ' PointID=' + str(pointNumberRequested);
        return self.queryDatabase.session.execute(query).fetchall();

    def getServoDataValuesForFlightPoint(self, pointNumberRequested):
        query = 'SELECT Servo0, Servo1, Servo2, Servo3, Servo4, Servo5, Servo6';
        query += ' Servo7, Servo8, Servo9, Servo10, Servo11, Servo12, Servo13, Servo14, Servo15';
        query += ' FROM ServoData WHERE FlightPathID=';
        query += str(self.flightNumber) + ' AND' + ' PointID=' + str(pointNumberRequested);
        return self.queryDatabase.session.execute(query).fetchall();

