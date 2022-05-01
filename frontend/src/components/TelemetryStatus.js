import { React, useEffect } from "react";
import  "./TelemetryStatusLayout.css"

let packet_rate = 0;
let now = new Date().getTime();
let last_packet = now;

function TelemetryStatus({telemetry}) {

    // every telemetry packet, calculate the since last packet
    useEffect(() => {
        now = new Date().getTime();
        packet_rate = 1/((now - last_packet)/1000);
        last_packet = now;
    }, [telemetry])

    // telemetry = undefined

    let pressure;
    if(telemetry?.enviro?.pressure) pressure = telemetry.enviro.pressure / 1000;

    return(
    
        <div className ="wrapper">
            <div className = "data1">Rate: { packet_rate.toFixed(1) } Hz</div>
            <div className = "data2">RX RSSI: { telemetry?.gndRadio?.rssi ?? '-' }</div>
            <div className = "data3">TX RSSI: { telemetry?.planeRadio?.rssi ?? '-' }</div>
            <div className = "data4">GPS Sats: { telemetry?.gps?.satellites ?? '-' }</div>
            <div className = "data5">Pressure: { pressure?.toFixed(2) ?? '-' } KPa</div>
            <div className = "data6">Temp: { telemetry?.enviro?.temperature?.toFixed(2) ?? '-' } °C</div>
        </div>
    )
}

export default TelemetryStatus;