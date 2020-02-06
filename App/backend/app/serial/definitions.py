# Serial message definitions

from app.Serial import util
from app.Serial.util import *

#from util import *

BYTE = 1
TWO_BYTES = 2
FOUR_BYTES = 4

START_BYTE = 0xAA
END_BYTE = 0xFF

ID_LOOKUP = {
    0 : 'Gnd Station',
    1 : 'Plane',
    2 : 'Glider 1',
    3 : 'Glider 2'
}

class Pitot:
    SIZE = 2
    ID = 0

    def __init__(self, buf=None):
        if buf:
            self.differential_pressure = signed_int16(buf)
        else:
            self.differential_pressure = 0

    def __str__(self):
        return 'Pitot \t Differential Pressure: {} Pa'.format(self.differential_pressure)

    def to_bytes(self):
        return int16_to_bytes(self.differential_pressure)

class IMU:
    SIZE = 24
    ID = 1

    def __init__(self, buf=None):
        if buf:
            self.ax = signed_int16(buf[22:24])
            self.ay = signed_int16(buf[20:22])
            self.az = signed_int16(buf[18:20])
            self.gx = signed_int16(buf[16:18])
            self.gy = signed_int16(buf[14:16])
            self.gz = signed_int16(buf[12:14])
            self.mx = signed_int16(buf[10:12])
            self.my = signed_int16(buf[8:10])
            self.mz = signed_int16(buf[6:8])
            self.yaw = signed_int16(buf[4:6])
            self.pitch = signed_int16(buf[2:4])
            self.roll = signed_int16(buf[0:2])
        else:
            self.ax = 0
            self.ay = 0
            self.az = 0
            self.gx = 0
            self.gy = 0
            self.gz = 0
            self.mx = 0
            self.my = 0
            self.mz = 0
            self.yaw = 0
            self.pitch = 0
            self.roll = 0

    def __str__(self):
        return 'IMU \t Accel X: {0}\
                  \n\t Accel Y: {1}\
                  \n\t Accel Z: {2}\
                  \n\t Gyro X: {3}\
                  \n\t Gyro Y: {4}\
                  \n\t Gyro Z: {5}\
                  \n\t Mag X: {6}\
                  \n\t Mag Y: {7}\
                  \n\t Mag Z: {8}\
                  \n\t Yaw: {9}\
                  \n\t Pitch: {10}\
                  \n\t Roll: {11}'.format(self.ax, self.ay, self.az, \
                                          self.gx, self.gy, self.gz, \
                                          self.mx, self.my, self.mz, \
                                          self.yaw, self.pitch, self.roll )
    def to_bytes(self):
        return int16_to_bytes(self.ax) + int16_to_bytes(self.ay) + int16_to_bytes(self.az) \
               + int16_to_bytes(self.gx) + int16_to_bytes(self.gy) + int16_to_bytes(self.gz) \
               + int16_to_bytes(self.mx) + int16_to_bytes(self.my) + int16_to_bytes(self.mz) \
               + int16_to_bytes(self.yaw) + int16_to_bytes(self.pitch) + int16_to_bytes(self.roll)

class GPS:
    SIZE = 21
    ID = 2
    def __init__(self, buf=None):
        if buf:
            self.lat = signed_int32(buf[17:21])
            self.lon = signed_int32(buf[13:17])
            self.speed = unsigned_int16(buf[11:13])
            self.satellites = int(str(buf[10]), 10)
            self.altitude = unsigned_int16(buf[8:10])
            self.time = unsigned_int32(buf[4:8])
            self.date = unsigned_int32(buf[0:4])
        else:
            self.lat = 0
            self.lon = 0
            self.speed = 0
            self.satellites = 0
            self.altitude = 0
            self.time = 0
            self.date = 0

    def __str__(self):
        return 'GPS \t Lat: {0}\
                  \n\t Lon: {1}\
                  \n\t Speed: {2}\
                  \n\t Satellites: {3}\
                  \n\t Altitude: {4}\
                  \n\t Time: {5}\
                  \n\t Date: {6}'.format(self.lat, self.lon, self.speed, \
                                         self.satellites, self.altitude, self.time, self.date)

    def to_bytes(self):
        return int32_to_bytes(self.lat) + int32_to_bytes(self.lon) + uint16_to_bytes(self.speed) + uint8_to_bytes(self.satellites) \
                + uint16_to_bytes(self.altitude) + uint32_to_bytes(self.time) + uint32_to_bytes(self.date) 

class Enviro:
    SIZE = 6
    ID = 3
    def __init__(self, buf=None):
        if buf:
            self.pressure = unsigned_int16(buf[4:6])
            self.humidity = unsigned_int16(buf[2:4])
            self.temperature = unsigned_int16(buf[0:2])
        else:
            self.pressure = 0
            self.humidity = 0
            self.temperature = 0

    def __str__(self):
        return 'Enviro \t Pressure: {0}\
                     \n\t Humidity: {1}\
                     \n\t Temperature: {2}'.format(self.pressure, self.humidity, self.temperature)

    def to_bytes(self):
        return uint16_to_bytes(self.pressure) + uint16_to_bytes(self.humidity) + uint16_to_bytes(self.temperature)

class Battery:
    SIZE = 4
    ID = 4
    def __init__(self, buf=None):
        if buf:
            self.voltage = unsigned_int16(buf[2:4])
            self.current = unsigned_int16(buf[0:2])
        else: 
            self.voltage = 0
            self.current = 0

    def __str__(self):
        return 'Batt \t Voltage: {0}\
                      \n\t Current: {1}'.format(self.voltage, self.current)

    def to_bytes(self):
        return uint16_to_bytes(self.voltage) + uint16_to_bytes(self.current)

class Config:
    # Leaves config spot as 0 so size needs to be 1 even if empty
    SIZE = 1
    ID = 5
    def __init__(self, buf=None):
        # Currently empty
        pass

    def __str__(self):
        # Currently empty
        return 'Config \t is empty'

    def to_bytes(self):
        return uint8_to_bytes(0)

class Status:
    SIZE = 6
    ID = 6
    def __init__(self, buf=None):
        if buf:
            self.rssi = signed_int16(buf[4:6])
            self.state = unsigned_int32(buf[0:4])
        else:
            self.rssi = 0
            self.state = 0

    def __str__(self):
        return 'Status \t RSSI: {0}\
                      \n\t State: {1}'.format(self.rssi, self.state)
    def to_bytes(self):
        return int16_to_bytes(self.rssi) + uint32_to_bytes(self.state)

class Servos:
    SIZE = 64
    ID = 7
    def __init__(self, buf=None):
        if buf:
            self.servo0 = unsigned_int32(buf[60:64])
            self.servo1 = unsigned_int32(buf[56:60])
            self.servo2 = unsigned_int32(buf[52:56])
            self.servo3 = unsigned_int32(buf[48:52])
            self.servo4 = unsigned_int32(buf[44:48])
            self.servo5 = unsigned_int32(buf[40:44])
            self.servo6 = unsigned_int32(buf[36:40])
            self.servo7 = unsigned_int32(buf[32:36])
            self.servo8 = unsigned_int32(buf[28:32])
            self.servo9 = unsigned_int32(buf[24:28])
            self.servo10 = unsigned_int32(buf[20:24])
            self.servo11 = unsigned_int32(buf[16:20])
            self.servo12 = unsigned_int32(buf[12:16])
            self.servo13 = unsigned_int32(buf[8:12])
            self.servo14 = unsigned_int32(buf[4:8])
            self.servo15 = unsigned_int32(buf[0:4])
        else:
            self.servo0 = 0
            self.servo1 = 0
            self.servo2 = 0
            self.servo3 = 0
            self.servo4 = 0
            self.servo5 = 0
            self.servo6 = 0
            self.servo7 = 0
            self.servo8 = 0
            self.servo9 = 0
            self.servo10 = 0
            self.servo11 = 0
            self.servo12 = 0
            self.servo13 = 0
            self.servo14 = 0
            self.servo15 = 0

    def __str__(self):
        return 'Servo \t Servo 0: {0}\
                      \n\t Servo 1: {1}\
                      \n\t Servo 2: {2}\
                      \n\t Servo 3: {3}\
                      \n\t Servo 4: {4}\
                      \n\t Servo 5: {5}\
                      \n\t Servo 6: {6}\
                      \n\t Servo 7: {7}\
                      \n\t Servo 8: {8}\
                      \n\t Servo 9: {9}\
                      \n\t Servo 10: {10}\
                      \n\t Servo 11: {11}\
                      \n\t Servo 12: {12}\
                      \n\t Servo 13: {13}\
                      \n\t Servo 14: {14}\
                      \n\t Servo 15: {15}'.format(self.servo0, self.servo1, self.servo2, self.servo3, \
                                                  self.servo4, self.servo5, self.servo6, self.servo7, self.servo8, \
                                                  self.servo9, self.servo10, self.servo11, self.servo12, self.servo13, \
                                                  self.servo14, self.servo15)

    def to_bytes(self):
        return uint32_to_bytes(self.servo0) + uint32_to_bytes(self.servo1) + uint32_to_bytes(self.servo2) + uint32_to_bytes(self.servo3) \
                + uint32_to_bytes(self.servo4) + uint32_to_bytes(self.servo5) + uint32_to_bytes(self.servo6) + uint32_to_bytes(self.servo7) \
                + uint32_to_bytes(self.servo8) + uint32_to_bytes(self.servo9) + uint32_to_bytes(self.servo10) + uint32_to_bytes(self.servo11) \
                + uint32_to_bytes(self.servo12) + uint32_to_bytes(self.servo13) + uint32_to_bytes(self.servo14) + uint32_to_bytes(self.servo15)

class AirData:
    SIZE = 36
    ID = 8
    def __init__(self, buf=None):
        if buf:
            self.ias = unsigned_int32(buf[32:36])
            self.eas = unsigned_int32(buf[28:32])
            self.tas = unsigned_int32(buf[24:28])
            self.agl = unsigned_int32(buf[20:24])
            self.pressure_alt = unsigned_int32(buf[16:20])
            self.msl = unsigned_int32(buf[12:16])
            self.density_alt = unsigned_int32(buf[8:12])
            self.approx_temp = unsigned_int32(buf[4:8])
            self.density = unsigned_int32(buf[0:4])
        else: 
            self.ias = 0
            self.eas = 0
            self.tas = 0
            self.agl = 0
            self.pressure_alt = 0
            self.msl = 0
            self.density_alt = 0
            self.approx_temp = 0
            self.density = 0


    def __str__(self):
        return 'AData \t IAS: {0}\
                        \n\t EAS: {1}\
                        \n\t TAS: {2}\
                        \n\t AGL: {3}\
                        \n\t Pressure Altitude: {4}\
                        \n\t MSL: {5}\
                        \n\t Density Altitude: {6}\
                        \n\t Approx Temperature: {7}\
                        \n\t Density: {8}'.format(self.ias, self.eas, self.tas, self.agl, \
                                            self.pressure_alt, self.msl, self.density_alt, self.approx_temp, self.density)
    def to_bytes(self):
        return uint32_to_bytes(self.ias) + uint32_to_bytes(self.eas) + uint32_to_bytes(self.tas) + uint32_to_bytes(self.agl) \
                + uint32_to_bytes(self.pressure_alt) + uint32_to_bytes(self.msl) + uint32_to_bytes(self.density_alt) + uint32_to_bytes(self.approx_temp) \
                + uint32_to_bytes(self.density)
class Commands:
    SIZE = 4
    ID = 9
    def __init__(self, buf=None):
        if buf:
            self.drop = int(str(buf[3]), 10)
            self.servos = unsigned_int16(buf[1:3])
            self.pitch = int(str(buf[0]), 10)
        else:
            self.drop = 0
            self.servos = 0
            self.pitch = 0

    def __str__(self):
        return 'Cmd \t Drop: {0}\
                      \n\t Servos: {1}\
                      \n\t Pitch Control: {2}'.format(self.drop, self.servos, self.pitch)

    def to_bytes(self):
        return uint8_to_bytes(self.drop) + uint16_to_bytes(self.servos) + uint8_to_bytes(self.pitch)


class DropAlgo:
    SIZE = 4
    ID = 10
    def __init__(self, buf=None):
        if buf:
            self.heading = signed_int16(buf[2:4])
            self.distance = unsigned_int16(buf[0:2])
        else:
            self.heading = 0
            self.distance = 0

    def __str__(self):
        return 'Drop \t Heading: {0}\
                         \n\t Distance: {1}'.format(self.heading, self.distance)

    def to_bytes(self):
        return int16_to_bytes(self.heading) + uint16_to_bytes(self.distance)