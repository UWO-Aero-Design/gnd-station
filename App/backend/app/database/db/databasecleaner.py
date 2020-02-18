from databasehelperclass import *

yes = "y"
print("Would you like to empty all tables? (y/n)")
ans = input()

if ans == yes:
    print("Are you sure? (y/n)")
    ans2 = input()
    if ans2 == yes:
        print("Clearing all tables...")
        planetable.query.delete()
        glidertable.query.delete()
        flightpathtable.query.delete()
        pointtable.query.delete()
        gpsvaluetable.query.delete()
        imuvaluestable.query.delete()
        environmentalsensortable.query.delete()
        batterystatustable.query.delete()
        systemstatustable.query.delete()
        servodatatable.query.delete()
        pitottubetable.query.delete()
        commandstable.query.delete()
        db.session.commit()
else:
    print("You selected No, Bye!")