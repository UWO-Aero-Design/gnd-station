import React, { useEffect, useState } from "react";

function WebcamCapture() {
  const [stream, setStream] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const [captureInterval, setCaptureInterval] = useState(null);
  const [captureDirectory, setCaptureDirectory] = useState(null);
  const [capturedFiles, setCapturedFiles] = useState([]);
  const [webcamActive, setWebcamActive] = useState(false);

  let captureObj = {};
  

  useEffect(() => {
    const checkWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((track) => track.stop());
        setWebcamActive(true);
      } catch (error) {
        setWebcamActive(false);
      }
    };

    checkWebcam();
    console.log(webcamActive)
    
  }, []);
  

  const startCapture = () => {
    const interval = setInterval(() => {
      const video = document.getElementById("video");
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const fileName = `${Date.now()}.png`;
      const blob = dataURItoBlob(canvas.toDataURL());
      const url = URL.createObjectURL(blob);
      const updatedCapturedFiles = [...capturedFiles, { name: fileName, url }];
      console.log(updatedCapturedFiles)
      setCaptureDirectory(blob)
      setCapturedFiles(updatedCapturedFiles);
    }, 33);

    setCaptureInterval(interval);
    setCapturing(true);
  };

  const stopCapture = () => {
    clearInterval(captureInterval);
    setCaptureInterval(null);
    setCapturing(false);
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div>
      <video id="video" autoPlay />
      {capturing ? (
        <button onClick={stopCapture}>Stop Capture</button>
      ) : (
        <button onClick={startCapture}>Start Capture</button>
      )}
      {capturedFiles.map((file) => (
        <div key={file.name}>
          <img src={file.url} alt={file.name} />
          <a href={file.url} onClick={()=>window.open(captureDirectory, "_blank").focus()}>
            Open Capture
          </a>
        </div>
      ))}
    </div>
  );
}

export default WebcamCapture;
