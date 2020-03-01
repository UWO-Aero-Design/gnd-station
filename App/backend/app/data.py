#Class definition for serial data

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