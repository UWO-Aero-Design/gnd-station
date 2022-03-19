from flask import Flask
from flask import request
from databasehelperclass import *
from flask import jsonify
from flask import render_template


#create Flask app
#app = Flask(__name__) 
#app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
@app.route('/datatable', methods=['GET','POST'])
def datatable():
         #determine if request from client is GET or POST
    if request.method == 'GET':
        #if GET request, obtain key information
        table = request.args.get('table')
        flightid = request.args.get('flightpathid')
        pointid = request.args.get('pointid')
        planeid = request.args.get('planeid')
        planeversion = request.args.get('planeversion')
        gliderid = request.args.get('gliderid')
        gliderversion = request.args.get('gliderversion')
        
        if table == 'Plane':
            obj = planetable.query.filter_by(PlandID=planeid).filter_by(PlaneVersion=planeversion).first()
            return jsonify(planerecord=obj.serialize)

        elif table == 'Glider':
            obj = glidertable.query.filter_by(GliderID=gliderid).filter_by(GliderVersion=gliderversion).first()
            return jsonify(gliderrecord=obj.serialize)

        elif table == 'FlightPath':
            obj = flightpathtable.query.filter_by(FlightPathID=flightid).first()
            return jsonify(flightpathrecord=obj.serialize)

        elif table == 'Point':
            obj = pointtable.query.filter_by(FlightPathID=flightid).filter_by(PointID=pointid).first()
            return jsonify(pointrecord=obj.serialize)

        elif table == 'GpsValue':
            obj = gpsvaluetable.query.filter_by(FlightPathID=flightid).filter_by(PointID = pointid).first()
            return jsonify(gpsvaluerecord=obj.serialize)

        elif table == 'ImuValues':
            obj = imuvaluestable.query.filter_by(FlightPathID=flightid).filter_by(PointID = pointid).first()
            return jsonify(imuvaluesrecord=obj.serialize)

        elif table == 'EnvironmentalSensorData':
            obj = environmentalsensortable.query.filter_by(FlightPathID=flightid).filter_by(PointID = pointid).first()
            return jsonify(environmentalrecord=obj.serialize)
        elif table == 'BatteryStatus':
            obj = batterystatustable.query.filter_by(FlightPathID=flightid).filter_by(PointID = pointid).first()
            return jsonify(batteryrecord=obj.serialize)

        elif table == 'SystemStatus':
            obj = systemstatustable.query.filter_by(FlightPathID=flightid).filter_by(PointID = pointid).first()
            return jsonify(systemstatusrecord=obj.serialize)

        elif table == 'ServoData':
            obj = servodatatable.query.filter_by(FlightPathID=flightid).filter_by(PointID = pointid).first()
            return jsonify(servorecord=obj.serialize)

        elif table == 'PitotTubeData':
            obj = pitottubetable.query.filter_by(FlightPathID=flightid).filter_by(PointID = pointid).first()
            return jsonify(pitottuberecord=obj.serialize)

        elif table == 'Commands':
            obj = commandstable.query.filter_by(FlightPathID=flightid).filter_by(PointID = pointid).first()
            return jsonify(commandsrecord=obj.serialize)
        else:
            #return error
            return 'Error'
    #process post request
    else:
        return 'TEST'
if __name__ == '__main__':
    app.run(debug=True, port=5000) #run app in debug mode on port 5000 
#db.init_app(app)