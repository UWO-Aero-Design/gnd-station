#Class definition for global data

class serialDataPrepackage:
    def __init__(self):
        self.IMU = None
        self.GPS = None
        self.Env = None
        self.Battery = None
        self.System = None
        self.Servo = None

        self.cmdDrop = None
        self.cmdServo = None
        self.cmdPitch = None
        self.destination = None

class serialDataReceive:
    def __init__(self):
        self.IMUData = None
        self.PitotData = None
        self.GPSData = None
        self.BatteryData = None
        self.EnviroData = None
        self.StatusData = None
        self.ServoData = None

class State:
    def __init__(self):
        self.point = 0
        self.flight = 0
        self.recording = False