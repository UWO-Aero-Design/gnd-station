import React, {useState, useEffect, useRef} from 'react';
import Container from './components/Container/Container';
import Camera from './components/Camera/Camera';
import Timer from './components/Timer/Timer';
import Altimeter from './components/Altimeter/Altimeter';
import Status from './components/Status/Status'
import Servo from './components/Servo'
import CreateRecording from './components/Record/CreateRecording';

const API_HOSTNAME = 'localhost:5000'
const WS_HOST = `ws://${API_HOSTNAME}`
const HTTP_HOST = `http://${API_HOSTNAME}`

const TELEMETRY_TIMEOUT = 1000;
let statusTelemetryTimeout;
let packet_rate = 0;
let last_packet = new Date().getTime();

let ws_reconnect_interval;

function App() {
  const [telemetry, setTelemetry] = useState({});
  const [altOffset, setAltOffset] = useState(0);
  const [status, setStatus] = useState('Loading...')
  const [ports, setPorts] = useState([])
  const [currentPort, setCurrentPort] = useState(null)
  const [isFlying, setIsFlying] = useState(false);
  const [currentStream, setCurrentStream] = useState(null);

  // https://stackoverflow.com/questions/60152922/proper-way-of-using-react-hooks-websockets
  // https://stackoverflow.com/questions/58432076/websockets-with-functional-components
  const ws = useRef(null);

  const ws_on_open = () => {
    console.log('connected');
    statusTelemetryTimeout = setTimeout(() => {
      setStatus('No Telemetry')
    }, TELEMETRY_TIMEOUT)
    update_com_ports();
    get_current_com_port();
    last_packet = new Date().getTime();
    clearInterval(ws_reconnect_interval);
    get_zero_alt();
  }

  const ws_on_message = (message) => {
    const data = JSON.parse(message.data);

    if(data.recipient.toUpperCase() === 'FRONTEND' && data.type.toUpperCase() === 'DEVICE_LIST') {
      const { devices } = data;
      setPorts(devices)
    }

    if(data.recipient.toUpperCase() === 'FRONTEND' && data.type.toUpperCase() === 'CURRENT_DEVICE') {
      const { path } = data;
      setCurrentPort(path)
    }

    if(data.recipient.toUpperCase() === 'FRONTEND' && data.type.toUpperCase() === 'TELEMETRY') {
      const telemetry = data.telemetry
      setTelemetry(telemetry);
      if(currentStream != data.stream) setCurrentStream(data.stream)

      let now = new Date().getTime();
      packet_rate = packet_rate = 1/((now - last_packet)/1000);
      last_packet = now;

      clearTimeout(statusTelemetryTimeout)
      statusTelemetryTimeout = setTimeout(() => {
        setStatus('No Telemetry')
        packet_rate = 0;
      }, TELEMETRY_TIMEOUT)

      if(telemetry.header.status == 1) {
        setStatus('PADA Armed')
      }
      else {
        setStatus('Ready')
      }
    }
  }

  const ws_on_close = (code) => {
    setStatus('Server Disconnected')
    clearTimeout(statusTelemetryTimeout)
    ws_reconnect_interval = setTimeout(ws_connect, 1000)
  }

  const ws_on_error = (error) => {
    // console.log(error)
  }

  const ws_connect = () => {
    try {
      ws.current = new WebSocket(WS_HOST);
      ws.current.onopen = ws_on_open
      ws.current.onmessage = ws_on_message
      ws.current.onclose =  ws_on_close
      ws.current.onerror =  ws_on_error
    } catch(e) {}
  }
  
  useEffect(()=> {
    ws_connect();
  },[]);

  const sendCommands = async(commands) => {
    fetch(`${HTTP_HOST}/command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json '},
      body: JSON.stringify({ commands })

      })
      .then(response => {
        if(response.status === 200) {
          commands.forEach(item => {
            console.log(`Post request using parameter: ${item.command}, and args: ${JSON.stringify(item.args)}`);
          })
        }
        else {
            console.log(`Error: ${response.status}`);
        }
        })
      .catch(error => {
        console.log(error)
      })  
  }

  const update_com_ports = () => {
    fetch(`${HTTP_HOST}/ground/com`, { method: 'POST' }).catch(error => { console.log(error) })
  }

  const get_current_com_port = () => {
    fetch(`${HTTP_HOST}/ground/com/current`, { method: 'POST' }).catch(error => { console.log(error) })
  }

  const select_com_port = (path) => {
    fetch(`${HTTP_HOST}/ground/com/select`, { method: 'POST', headers: { 'Content-Type': 'application/json '}, body: JSON.stringify({ path }) })
      .then(response => {
        if(response.status === 200) {
          console.log('success')
        }
        else {
            console.log(`Error: ${response.status}`);
        }
        })
      .catch(error => console.log(error)) 
  }

  const get_zero_alt = (path) => {
    fetch(`${HTTP_HOST}/ground/offset/alt`, { method: 'GET' })
      .then(response => response.json())
      .then(data => setAltOffset(data.alt_offset))
      .catch(error => console.log(error)) 
  }

  const reset_alt = () => {
    setAltOffset(0)
    fetch(`${HTTP_HOST}/ground/offset/alt`, { method: 'POST', headers: { 'Content-Type': 'application/json '}, body: JSON.stringify({ offset: '0' }) })
      .catch(error => console.log(error))
  }

  const zero_alt = () => {
    setAltOffset(telemetry.enviro.altitude)
    fetch(`${HTTP_HOST}/ground/offset/alt`, { method: 'POST', headers: { 'Content-Type': 'application/json '}, body: JSON.stringify({ offset: telemetry.enviro.altitude }) })
      .catch(error => console.log(error))
  }

  
  // Note: If there's time, make the sizes dynamic,
  // Otherwise, use values hard coded in the example

  return (
    <div className="full-screen">
      <div className="gnd-grid">
        <div className="camera-item">
          <Container className="camera-item" content={ <Camera></Camera> }></Container>
        </div>
        <div className="timer-item">
          <Timer telemetry={telemetry} isFlying={ isFlying }></Timer>
        </div>
        <div className="altitude-item">
          <Container className="map-item" content={
            <Altimeter telemetry={telemetry} dropCommand = {()=> { sendCommands([{ command:'ACTUATE_GROUP', args:{ group: 'DROP_PADA', state: 'OPEN' } }])}}
                        resetCommand = {()=> { sendCommands([{ command:'ACTUATE_GROUP', args:{ group: 'DROP_PADA', state: 'CLOSE' } }])}}
                        offset={altOffset} zeroAlt={ zero_alt } resetAlt={ reset_alt }>
            </Altimeter>
          }>
          </Container>
        </div>
        <div className="record-item">
          <Container>
           
          </Container>
           <CreateRecording></CreateRecording>
        </div>
        <div className="status-item">
        <Container className="camera-item" content={
          <Status telemetry={ telemetry } status={ status } ports={ ports } updateComPorts={ update_com_ports }
                  selectComPort={ select_com_port } currentPort={ currentPort } packetRate={ packet_rate } sendCommands={ sendCommands }
                  currentStream={ currentStream }
          ></Status> }>
        </Container>
        </div>
        <div className="record-list-item">
          <Container>
          <Servo></Servo>
          </Container>
        </div>
      </div>
    </div>
  );
}

export default App;
