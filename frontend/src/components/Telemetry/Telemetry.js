import { React, useEffect } from "react";
import  "./Telemetry.css"

function Telemetry({ telemetry, packetRate }) {

    // every telemetry packet, calculate the since last packet
    // useEffect(() => {
    //     now = new Date().getTime();
    //     packet_rate = 1/((now - last_packet)/1000);
    //     last_packet = now;
    // }, [telemetry])

    let pressure;
    if(telemetry?.enviro?.pressure) pressure = telemetry.enviro.pressure / 1000;

    return(
    
        <div className ="status-telemetry-grid">
            <div className = "status-telemetry-grid-1">Rate: { packetRate.toFixed(1) } Hz</div>
            <div className = "status-telemetry-grid-2">RX RSSI: { telemetry?.gndRadio?.rssi ?? '-' }</div>
            <div className = "status-telemetry-grid-3">TX RSSI: { telemetry?.planeRadio?.rssi ?? '-' }</div>
            <div className = "status-telemetry-grid-4">Packet: { telemetry?.header?.packetNumber ?? '-' }</div>
            <div className = "status-telemetry-grid-5">GPS Sats: { telemetry?.gps?.satellites ?? '-' }</div>
            <div className = "status-telemetry-grid-6">Temp: { telemetry?.enviro?.temperature?.toFixed(2) ?? '-' } °C</div>
        </div>
    )
}

export default Telemetry;