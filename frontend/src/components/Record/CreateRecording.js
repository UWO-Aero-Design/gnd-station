import React, {useState} from "react";
import './Recording.css';
import { useReactMediaRecorder } from "react-media-recorder";


const GREEN = '#00e676';
const RED = '#ff1744';

const CreateRecording = () =>{
    const [isRecording, setIsRecording] = useState(false);
    const [recordingName,setRecordingName] = useState('');
    const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ screen: true,audio:false, blobPropertyBag:{type:'video/mp4'} });


    const startRecordingDB = async()=>{
      await fetch ('http://localhost:5000/record',{ method: 'POST', 
      headers: { 'Content-Type': 'application/json '},
       body: JSON.stringify({ action: "start" }) })
    }

    const stopRecordingDB = async()=>{
      await fetch ('http://localhost:5000/record',{ method: 'POST', 
      headers: { 'Content-Type': 'application/json '},
       body: JSON.stringify({ action: "stop" }) })
    }
    
    let Recordings = [];

    const downloadRecording = () => {
        const pathName = `${recordingName}.mp4`;
        try {
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // for IE
            window.navigator.msSaveOrOpenBlob(mediaBlobUrl, pathName);
            Recordings.push(mediaBlobUrl)
          } else {
            // for Chrome
            const link = document.createElement("a");
            link.href = mediaBlobUrl;
            link.download = pathName;
            Recordings.push(mediaBlobUrl)
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        } catch (err) {
          console.error(err);
        }
      };
      const viewRecording = () => {
        console.log(Recordings)
        window.open(mediaBlobUrl, "_blank").focus();
      };

      function setName(e){
        setRecordingName(e.target.value)
        console.log(recordingName)
      }

    function triggerRecord(){
        setIsRecording(!isRecording);
        if(isRecording){
           stopRecording();
           downloadRecording();
           stopRecordingDB();
           setRecordingName('');
        }
        else{
            startRecordingDB();
            startRecording();
        }
    }
 const background_color = isRecording ? RED:GREEN;

    return(
        <div className='create-recording'>
        <div >
            <input className='altimeter-button' 
            placeholder="Recording Name..."
            type="text"
            value = {recordingName}
            onChange = {setName}
            ></input>
         </div>
        <div className='recording-button-bottom'>
            <button className='recording-button' onClick = {triggerRecord} style={{ backgroundColor: background_color }}>{isRecording ? 'Stop Recording':'Start Recording'}</button>
            {isRecording ? '':<button  className = 'recording-button'onClick = {viewRecording}> View Recording</button>}
            <p>{status}</p>
        </div>
        </div>
    )
}

export default CreateRecording