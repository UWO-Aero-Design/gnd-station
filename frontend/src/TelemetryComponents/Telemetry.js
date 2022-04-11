import React, { useState, useEffect } from "react";
import IMU from "./IMU";
import Battery from "./Battery";
import Enviro from "./Enviro";
import GPS from "./GPS"; 
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket('ws://127.0.0.1:3001');

function getTelemetry(){
  //give an initial state so that the data won't be undefined at start
  const [telemetry, setTelemetry] = useState([]);

  useEffect(() =>
  client.onmessage = (message)=>{
    const data = JSON.parse(message.data);
    setTelemetry(data);
    console.log(data);
    return() =>{
      client.disconnect();
    }
  },[]);
  return telemetry;
}
 

//Function to get all data from functions above and display it
function Telemetry() {

   const telem = getTelemetry();
  
useEffect(()=>{
  client.onopen=() =>{
    console.log('connected');
  }
  
  client.onclose = () =>{
    console.log("disconnected");
  }
  
},[])
  
  return(
    <div>
      <Battery
      voltage={telem.battery?.voltage}
      current={telem.battery?.current}/>
         <IMU 
      ax = {telem.imu?.ax}
      ay = {telem.imu?.ay}
      az = {telem.imu?.az}
      gx = {telem.imu?.gx}
      gy = {telem.imu?.gy}
      gz = {telem.imu?.gz}
      mx = {telem.imu?.mx}
      my = {telem.imu?.my}
      mz = {telem.imu?.mz}
      yaw = {telem.imu?.yaw}
      pitch = {telem.imu?.pitch}
      roll = {telem.imu?.roll}
      /> 
      <Enviro
      altitude={telem.enviro?.altitude}
      temperature={telem.enviro?.temperature}
      pressure = {telem.enviro?.pressure}
      />
      <GPS
      fix = {telem.gps?.fix}
      lon={telem.gps?.lon}
      lat = {telem.gps?.lat}
      speed = {telem.gps?.speed}
      satellites = {telem.gps?.satellites}
      altitude = {telem.gps?.altitude}
      time = {telem.gps?.time}
      date = {telem.gps?.date}
      /> 
    </div>
  )
}
export default Telemetry;