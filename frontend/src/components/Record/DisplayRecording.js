import React, {useState, useEffect} from 'react';

const DisplayRecording = () =>{
    const [recordings,setRecordings] = useState();
    useEffect(()=>{
        set_recordings()
    })
     
    const set_recordings = () => {
        fetch('http://localhost:5000/record',{
        method:'GET',
    }).then(res =>res.json()).then(data =>
        setRecordings(data.recordings))
    }

    const get_recordings = () =>{
        set_recordings()
        let result;
        if(recordings.length() == 0) result = <option value='DEFAULT' disabled >No Recordings</option>
        else {
            result = recordings.map((recording, key) => {
                return <option key={key} value={recording.name} >{recording.name}</option>
            })
        }
        return result;
    }

    return(
        <select>{get_recordings()}</select>
    )

}

export default DisplayRecording;