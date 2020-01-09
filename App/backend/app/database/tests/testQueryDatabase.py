from queryDatabase import QueryDatabase

# creating query connections
test_1 = QueryDatabase(1);
test_2 = QueryDatabase(2);
test_3 = QueryDatabase(3);

# testing flight path table query
query_1 = test_1.getFlightPathInfo();
query_2 = test_2.getFlightPathInfo();
query_3 = test_3.getFlightPathInfo();

# access specific rows by using query_1[rowNum]
# access specific columns by using query_1[rowNum][colNum]
# remember list and tuple indices start from 0

print(len(query_1));
print(len(query_2));
print(len(query_3));

print(query_1);
print(query_2);
print(query_3);

# testing point table query
query_1 = test_1.getPointInfoForFlight();
query_2 = test_2.getPointInfoForFlight();
query_3 = test_3.getPointInfoForFlight();

print(len(query_1));
print(len(query_2));
print(len(query_3));


print(query_1);
print(query_2);
print(query_3);

# testing gps table query
query_1 = test_1.getGPSValuesForFlight();
query_2 = test_2.getGPSValuesForFlight();
query_3 = test_3.getGPSValuesForFlight();

print(len(query_1));
print(len(query_2));
print(len(query_3));

print(query_1);
print(query_2);
print(query_3);

# testing IMU table query
query_1 = test_1.getIMUValuesForFlight();
query_2 = test_2.getIMUValuesForFlight();
query_3 = test_3.getIMUValuesForFlight();

print(len(query_1));
print(len(query_2));
print(len(query_3));

print(query_1);
print(query_2);
print(query_3);

# testing Environmental Sensor table query
query_1 = test_1.getEnvironmentalSensorForFlight();
query_2 = test_2.getEnvironmentalSensorForFlight();
query_3 = test_3.getEnvironmentalSensorForFlight();

print(len(query_1));
print(len(query_2));
print(len(query_3));

print(query_1);
print(query_2);
print(query_3);

# testing Battery table query
query_1 = test_1.getBatteryStatusForFlight();
query_2 = test_2.getBatteryStatusForFlight();
query_3 = test_3.getBatteryStatusForFlight();

print(len(query_1));
print(len(query_2));
print(len(query_3));

print(query_1);
print(query_2);
print(query_3);

# testing system status table query
query_1 = test_1.getSystemStatusForFlight();
query_2 = test_2.getSystemStatusForFlight();
query_3 = test_3.getSystemStatusForFlight();

print(len(query_1));
print(len(query_2));
print(len(query_3));

print(query_1);
print(query_2);
print(query_3);

# testing servo data table query
query_1 = test_1.getServoDataForFlight();
query_2 = test_2.getServoDataForFlight();
query_3 = test_3.getServoDataForFlight();

print(len(query_1));
print(len(query_2));
print(len(query_3));

print(query_1);
print(query_2);
print(query_3);


# testing individual point queries

# testing gps table query
query_1 = test_1.getGPSValuesForFlightPoint(2);
query_2 = test_2.getGPSValuesForFlightPoint(7);
query_3 = test_3.getGPSValuesForFlightPoint(9);

print(query_1);
print(query_2);
print(query_3);

# testing IMU table query
query_1 = test_1.getIMUValuesForFlightPoint(17);
query_2 = test_2.getIMUValuesForFlightPoint(23);
query_3 = test_3.getIMUValuesForFlightPoint(1);

print(query_1);
print(query_2);
print(query_3);

# testing Environmental Sensor table query
query_1 = test_1.getEnvironmentalSensorValuesForFlightPoint(16);
query_2 = test_2.getEnvironmentalSensorValuesForFlightPoint(12);
query_3 = test_3.getEnvironmentalSensorValuesForFlightPoint(9);

print(query_1);
print(query_2);
print(query_3);

# testing Battery table query
query_1 = test_1.getBatteryStatusValuesForFlightPoint(3);
query_2 = test_2.getBatteryStatusValuesForFlightPoint(4);
query_3 = test_3.getBatteryStatusValuesForFlightPoint(5);

print(query_1);
print(query_2);
print(query_3);

# testing system status table query
query_1 = test_1.getSystemStatusValuesForFlightPoint(2);
query_2 = test_2.getSystemStatusValuesForFlightPoint(8);
query_3 = test_3.getSystemStatusValuesForFlightPoint(19);

print(query_1);
print(query_2);
print(query_3);

# testing servo data table query
query_1 = test_1.getServoDataValuesForFlightPoint(21);
query_2 = test_2.getServoDataValuesForFlightPoint(25);
query_3 = test_3.getServoDataValuesForFlightPoint(2);

print(query_1);
print(query_2);
print(query_3);