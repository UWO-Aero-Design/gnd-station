import React, {useState} from "react";
import Button from '../Button/Button';
import './Recording.css';
import { useReactMediaRecorder } from "react-media-recorder";


const GREEN = '#00e676';
const RED = '#ff1744';

const CreateRecording = () =>{
    const [isRecording, setIsRecording] = useState(false);
    const [recordingName,setRecordingName] = useState('');
    const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ screen: true, blobPropertyBag:{type:"video/MOV"} });

    const downloadRecording = () => {
        const pathName = `${recordingName}.mov`;
        try {
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // for IE
            window.navigator.msSaveOrOpenBlob(mediaBlobUrl, pathName);
          } else {
            // for Chrome
            const link = document.createElement("a");
            link.href = mediaBlobUrl;
            link.download = pathName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        } catch (err) {
          console.error(err);
        }
      };
      const viewRecording = () => {
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
           setRecordingName('');
        }
        else{
            startRecording();
        }
    }
 const background_color = isRecording ? RED:GREEN;

    return(
        <div className='create-recording'>
        <div className='altimeter-input-top'>
            <input className='altimeter-button' 
            placeholder="Recording Name..."
            type="text"
            value = {recordingName}
            onChange = {setName}
            ></input>
         </div>
        <div className='recording-button-bottom'>
            <p>{status}</p>
            <button className='recording-button' onClick = {triggerRecord} style={{ backgroundColor: background_color }}>{isRecording ? 'Stop Recording':'Start Recording'}</button>
            {isRecording ? '':<button onClick = {viewRecording}> View Recording</button>}
        </div>
        </div>
    )
}

export default CreateRecording