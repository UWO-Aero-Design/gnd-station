import React, {useState, useEffect, useRef} from 'react';
import { Container, Grid, Box, ListItem, List } from '@mui/material';
import Header from './components/Header';
import Servo from './components/Servo';
import Status from './components/Status';
import Altimeter from './components/Altimeter';
import { w3cwebsocket as W3CWebSocket } from "websocket";

function App() {
  //function that receives data from web socket
  const [telemetry, setTelemetry] = useState({ battery: {}, imu:{}, gps:{}, enviro:{}});
  // https://stackoverflow.com/questions/60152922/proper-way-of-using-react-hooks-websockets
  // https://stackoverflow.com/questions/58432076/websockets-with-functional-components
  const ws = useRef(null);
  
  useEffect(()=>{
    ws.current= new W3CWebSocket('ws://localhost:5000');
    ws.current.onopen=() =>{
      console.log('connected');
    }
    
    ws.current.onclose = () =>{
      console.log("disconnected");
    }

    ws.current.onmessage = (message)=> {
      const data = JSON.parse(message.data);
      const telemetry = data.telemetry
      setTelemetry(telemetry);
      //console.log(data);
    }

  },[]);

  // const success = () =>{
  //   //Add overlay to show success message
  // }
  // const errorMessage = () =>{
  //   //Add overlay to show error message
  // }

  //add http request for command to backend
  //Backend call for command using http request

  const sendCommands = async(commands) => {
    fetch('http://localhost:5000/command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json '},
      body: JSON.stringify({ commands })

      }).then(response => {
        if(response.status === 200) {
          commands.forEach(item => {
            console.log(`Post request using parameter: ${item.command}, and args: ${JSON.stringify(item.args)}`);
          })
        }
        else {
            console.log(`Error: ${response.status}`);
        }
        }).catch(error => {
          console.log(error)
        })
    
}

  
  // Note: If there's time, make the sizes dynamic,
  // Otherwise, use values hard coded in the example

  return (
    <Container sx={{ backgroundColor: '#000000', minHeight: '100vh', minWidth: '100vw' }}>
      <Header />
      <Grid container spacing={0} sx={{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%' }}>
        {/* This is a template for the ground station. Will need to be adapted as components are added */}
        <Grid item sx={{ width: '40%', height: '95vh' }}>
          <List>
            <ListItem>
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', height: '45vh', backgroundColor: '#777772', borderRadius: '16px'}}>
                Example section
              </Box>
            </ListItem>
            <ListItem>
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', height: '42vh', backgroundColor: '#777772', borderRadius: '16px'}}>
                Example section
              </Box>
            </ListItem>
          </List>
        </Grid>
        <Grid item sx={{ width: '20%', height: '95vh' }}>
          <List>
            <ListItem>
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', height: '25vh', backgroundColor: '#777772', borderRadius: '16px'}}>
                Example section
              </Box>
            </ListItem>
            <ListItem>
              <Altimeter
              telemetry={telemetry}
              dropCommand = {()=> { sendCommands([{ command:'ACTUATE_GROUP', args:{ group: 'DROP_PADA', state: 'OPEN' } }])}}
              resetCommand = {()=> { sendCommands([{ command:'ACTUATE_GROUP', args:{ group: 'DROP_PADA', state: 'CLOSE' } }])}} />
            </ListItem>
            <ListItem>
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', height: '25vh', backgroundColor: '#777772', borderRadius: '16px'}}>
                Example section
              </Box>
            </ListItem>
          </List>
        </Grid>
        <Grid item sx={{ width: '40%', height: '95vh'}}>
          <List>
            <ListItem>
              <Status
              telemetryStatus ={telemetry}/>
            </ListItem>
            <ListItem>
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', height: '25vh', backgroundColor: '#777772', borderRadius: '16px'}}>
                Example section
              </Box>
            </ListItem>
            <ListItem>
              <Servo/>
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
