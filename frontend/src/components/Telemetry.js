import React from 'react';
import TelemetryStatus from "./TelemetryStatus";

 
//Function to get all data from functions above and display it
function Telemetry({telemetryData}) {

  // const [telemetry, setTelemetry] = useState({ battery: {}, imu:{}, gps:{}, enviro:{}});

  // // https://stackoverflow.com/questions/60152922/proper-way-of-using-react-hooks-websockets
  // // https://stackoverflow.com/questions/58432076/websockets-with-functional-components
  // const ws = useRef(null);
  
  // useEffect(()=>{
  //   ws.current= new W3CWebSocket('ws://127.0.0.1:3001');
  //   ws.current.onopen=() =>{
  //     console.log('connected');
  //   }
    
  //   ws.current.onclose = () =>{
  //     console.log("disconnected");
  //   }

  //   ws.current.onmessage = (message)=> {
  //     const data = JSON.parse(message.data);
  //     setTelemetry(data);
  //     console.log(data);
  //   }

  // },[]);


  return(

      <TelemetryStatus
      telemetry = {telemetryData}
      />
    
  )
}
export default Telemetry;