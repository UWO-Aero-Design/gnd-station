import React,{useState, useEffect, useRef} from "react";
import "./Camera.css";

const Camera = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const videoRef = useRef(null); 
  const canvasRef = useRef(null);
  const videoWidth = 1000;
  const videoHeight = 700;

  const [webcamActive, setWebcamActive] = useState(false);

 
  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL("image/png");

    // Do something with the captured image data, such as display it in an <img> element or upload it to a server
  };


  useEffect(() => {
    async function getDevices() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);
      const fpvReceiver = videoDevices.filter(device =>
        device.label === "USB2.0 PC CAMERA (18ec:5850)"
        )
        console.log(fpvReceiver)
      if(fpvReceiver.length == 1){
        setSelectedDevice(fpvReceiver);
      }
      else{
        return "No FPV Receiver Connected"
      }
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
    if (deviceId !== "Disable Camera") {
      const selected = devices.find(device => device.deviceId === deviceId);
      setSelectedDevice(selected);
      console.log(deviceId);
      setWebcamActive(true);
    } else {
      setSelectedDevice(null);
      setWebcamActive(false);
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
