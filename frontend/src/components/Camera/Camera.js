import React,{useState, useEffect, useRef} from "react";
import "./Camera.css";

const Camera = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const videoRef = useRef(null);
  const videoWidth = 1990;
  const videoHeight = 550;


  useEffect(() => {
    async function getDevices() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);
      setSelectedDevice(videoDevices[0]);
    }
    getDevices();
  }, []);

  useEffect(() => {
    if (selectedDevice) {
      const constraints = { 
        video: {
        deviceId: selectedDevice.deviceId,
        width: videoWidth,
        height: videoHeight
      } };
      navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
          videoRef.current.srcObject = stream;
        })
        .catch(err => console.log(err));
    } else {
      videoRef.current.srcObject = null;
    }
  }, [selectedDevice, videoWidth, videoHeight]);

  function handleDeviceChange(event) {
    const deviceId = event.target.value;
    if (deviceId) {
      const selected = devices.find(device => device.deviceId === deviceId);
      setSelectedDevice(selected);
    } else {
      setSelectedDevice(null);
    }
  }
  

  return (
    <div style={{ display:"flex",position: 'relative', justifyContent:"center" }}>
    <div className="select-container">
    <select value={selectedDevice?.deviceId} onChange={handleDeviceChange}>
  <option value={null}>Disable Camera</option>
  {devices.map(device => (
    <option key={device.deviceId} value={device.deviceId}>
      {device.label}
    </option>
  ))}
    </select>

    </div>
    <video ref={videoRef} autoPlay playsInline />
  </div>
  );
};

export default Camera;
