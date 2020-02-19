from databasehelperclass import db
from databasehelperclass import planetable
from databasehelperclass import glidertable
from databasehelperclass import flightpathtable
from databasehelperclass import pointtable
from databasehelperclass import gpsvaluetable
from databasehelperclass import imuvaluestable
from databasehelperclass import environmentalsensortable
from databasehelperclass import batterystatustable 
from databasehelperclass import systemstatustable
from databasehelperclass import servodatatable 
from databasehelperclass import pitottubetable
from databasehelperclass import commandstable
import random
from random import randint

#get user specifed # of rows to add into each table
print("Please specify how many rows of data to add?")
count = int(input(),10)



#clear flightpath table
flightpathtable.query.delete()
db.session.commit()
#fill flightpath table

#add flightpath id #1
exobj = flightpathtable(
    1,
    "test1",
    float(1),
    "test1",
    float(1),
    float(1),
    float(1),
    float(1))
db.session.add(exobj)
db.session.commit()

#add flightpath id #2
exobj = flightpathtable(
    2,
    "test2",
    float(2),
    "test2",
    float(2),
    float(2),
    float(2),
    float(2))
db.session.add(exobj)
db.session.commit()

#fill plane table
for i in range(0,count):
    exobj = planetable(i,i)
    db.session.add(exobj)
    db.session.commit()


#fill glider table
for i in range(0,count):
    exobj = glidertable(i,i)
    db.session.add(exobj)
    db.session.commit()

#fill point table
#fill values with flight path id # 1
for i in range(0,count):
    exobj = pointtable(1,i)
    db.session.add(exobj)
    db.session.commit()

#fill values with flight path id # 2
for i in range(0,count):
    exobj = pointtable(2,i)
    db.session.add(exobj)
    db.session.commit()

#fill  gps values table
#fill values with flight path id # 1
for i in range(0,count):
    exobj = gpsvaluetable(
    float(i),
    float(i),
    float(i),
    i,
    float(i),
    i,
    i,
    1,
    i)
    db.session.add(exobj)
    db.session.commit()
#fill values with flight path id # 2
for i in range(0,count):
    exobj = gpsvaluetable(
    float(i),
    float(i),
    float(i),
    i,
    float(i),
    i,
    i,
    2,
    i)
    db.session.add(exobj)
    db.session.commit()

#fill imuvalues table
#flight path id # 1
for i in range(0,count):
    exobj = imuvaluestable(
        float(i),
        float(i),
        float(i),
        float(i),
        float(i),
        float(i),
        float(i),
        float(i),
        float(i),
        float(i),
        float(i),
        float(i),
        1,
        i)
    db.session.add(exobj)
    db.session.commit()
#flight path id # 2
for i in range(0,count):
    exobj = imuvaluestable(
        float(i),
        float(i),
        float(i),
        float(i),
        float(i),
        float(i),
        float(i),
        float(i),
        float(i),
        float(i),
        float(i),
        float(i),
        2,
        i)
    db.session.add(exobj)
    db.session.commit()

#fill enviromentalsensor table
#flightpath id #1
for i in range(0,count):
    exobj = environmentalsensortable(
        float(i),
        float(i),
        float(i),
        float(i),
        float(i),
        1,
        i)
    db.session.add(exobj)
    db.session.commit()
#flightpath id #2
for i in range(0,count):
    exobj = environmentalsensortable(
        float(i),
        float(i),
        float(i),
        float(i),
        float(i),
        2,
        i)
    db.session.add(exobj)
    db.session.commit()

#fill battery status table
#flightpathid #1
for i in range(0,count):
    exobj = batterystatustable(float(i),float(i),float(i),1,i)
    db.session.add(exobj)
    db.session.commit()
#flightpathid #2
for i in range(0,count):
    exobj = batterystatustable(float(i),float(i),float(i),2,i)
    db.session.add(exobj)
    db.session.commit()

#fill system status status table
#flightpathid #1
for i in range(0,count):
    exobj = systemstatustable(float(i),i,1,i)
    db.session.add(exobj)
    db.session.commit()
#flightpathid #2
for i in range(0,count):
    exobj = systemstatustable(float(i),i,2,i)
    db.session.add(exobj)
    db.session.commit()

#fill servodata table
#flightpathid #1
for i in range(0,count):
    exobj = servodatatable(
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        1,
        i)
    db.session.add(exobj)
    db.session.commit()
#flightpathid #2
for i in range(0,count):
    exobj = servodatatable(
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        2,
        i)
    db.session.add(exobj)
    db.session.commit()

#fill pitottube table
#flightpathid #1
for i in range(0,count):
    exobj = pitottubetable(float(i),1,i)
    db.session.add(exobj)
    db.session.commit()
#flightpathid #2
for i in range(0,count):
    exobj = pitottubetable(float(i),2,i)
    db.session.add(exobj)
    db.session.commit()


#fill Commands table
#flightpathid #1
for i in range(0,count):
    exobj = commandstable(
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        float(i),
        1,
        i)
    db.session.add(exobj)
    db.session.commit()

#flightpathid #2
for i in range(0,count):
    exobj = commandstable(
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        i,
        float(i),
        2,
        i)
    db.session.add(exobj)
    db.session.commit()