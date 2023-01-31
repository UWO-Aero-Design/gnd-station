import React from "react";
import "./Camera.css";

const Camera = () => {
  if (!navigator.mediaDevices?.enumerateDevices) {
    console.log("enumerateDevices() not supported.");
  // } else {
  //   // List cameras and microphones.
  //   navigator.mediaDevices.enumerateDevices()
  //     .then((devices) => {
  //       devices.forEach((device) => {
  //         console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
  //       });
  //     })
  //     .catch((err) => {
  //       console.error(`${err.name}: ${err.message}`);
  //     });
  }  
  return (
      <div className="webcam-video">
        <img src = {'sample_camera.png'} alt = "sample_camera"/>
      </div>
  );
};

export default Camera;
