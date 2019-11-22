# Serial module
#   Must install PySerial
""" import builder
import connection
import definitions
import events
import parser
import util """


# Contains:
#   builder.py --> used to build messages to send over serial
#   connection.py --> used to handle serial connection events
#   definitions.py --> contains message protocol definition
#   events.py --> contains post-read and pre-write serial event handler
#   parser.py --> used tp parser messages received over serial
#   util.py --> utility functions