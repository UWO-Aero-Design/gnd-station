import React from "react";
import  "./TelemetryStatusLayout.css"

function TelemetryStatus({telemetry}){

    let batteryVoltage = (parseFloat(telemetry.battery.voltage).toFixed(2));
    let batteryCurrent = (parseFloat(telemetry.battery.current).toFixed(2));
    let satellite = (parseFloat(telemetry.gps.satellites).toFixed(2));
    let status = (parseFloat(telemetry.status).toFixed(2));
    let temperature = (parseFloat(telemetry.enviro.temperature).toFixed(2));

    return(
    
        <div class ="wrapper">
        <div class = "data1">Signal Strength {telemetry === undefined ? 0 : telemetry.rssi}</div>
        <div class = "data2">Battery Voltage {telemetry === undefined ? 0 : batteryVoltage}</div>
        <div class = "data3">Battery Percent {telemetry === undefined ? 0 : batteryCurrent}</div>
        <div class = "data4">GPS Status (fix){telemetry === undefined ? 0 : satellite}</div>
        <div class = "data5">Telemetry {telemetry === undefined ? 0 : status}</div>
        <div class = "data6">Temperature {telemetry === undefined ? 0 : temperature}</div>
        </div>
    )
}

export default TelemetryStatus;