import React, { useState, useEffect, useRef } from "react";
// import IMU from "./IMU";
import Battery from "./Battery";
// import Enviro from "./Enviro";
// import GPS from "./GPS"; 
import { w3cwebsocket as W3CWebSocket } from "websocket";
 

//Function to get all data from functions above and display it
function Telemetry() {

  const [telemetry, setTelemetry] = useState({ battery: {} });

  // https://stackoverflow.com/questions/60152922/proper-way-of-using-react-hooks-websockets
  // https://stackoverflow.com/questions/58432076/websockets-with-functional-components
  const ws = useRef(null);
  
  useEffect(()=>{
    ws.current= new W3CWebSocket('ws://127.0.0.1:3001');
    ws.current.onopen=() =>{
      console.log('connected');
    }
    
    ws.current.onclose = () =>{
      console.log("disconnected");
    }

    ws.current.onmessage = (message)=> {
      const data = JSON.parse(message.data);
      setTelemetry(data);
      console.log(data);
    }

  },[]);


  return(
    // <div>
      <Battery
      voltage={telemetry === undefined ? 0 : telemetry.battery.voltage}
      current={telemetry === undefined ? 0 : telemetry.battery.current}
      />
    //   <IMU 
    //     ax = {telemetry.imu.ax}
    //     ay = {telemetry.imu.ay}
    //     az = {telemetry.imu.az}
    //     gx = {telemetry.imu.gx}
    //     gy = {telemetry.imu.gy}
    //     gz = {telemetry.imu.gz}
    //     mx = {telemetry.imu.mx}
    //     my = {telemetry.imu.my}
    //     mz = {telemetry.imu.mz}
    //     yaw = {telemetry.imu.yaw}
    //     pitch = {telemetry.imu.pitch}
    //     roll = {telemetry.imu.roll}
    //   /> 
    //   <Enviro
    //     altitude={telemetry.enviro.altitude}
    //     temperature={telemetry.enviro.temperature}
    //     pressure = {telemetry.enviro.pressure}
    //   />
    //   <GPS
    //     fix = {telemetry.gps.fix}
    //     lon={telemetry.gps.lon}
    //     lat = {telemetry.gps.lat}
    //     speed = {telemetry.gps.speed}
    //     satellites = {telemetry.gps.satellites}
    //     altitude = {telemetry.gps.altitude}
    //     time = {telemetry.gps.time}
    //     date = {telemetry.gps.date}
    //   /> 
    // </div>
  )
}
export default Telemetry;