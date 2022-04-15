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
    ws.current= new W3CWebSocket('ws://127.0.0.1:3001');
    ws.current.onopen=() =>{
      console.log('connected');
    }
    
    ws.current.onclose = () =>{
      console.log("disconnected");
    }

    ws.current.onmessage = (message)=> {
      const data = JSON.parse(message.data);
      setTelemetry(data);
      console.log(data);
    }

  },[]);

  // Note: If there's time, make the sizes dynamic,
  // Otherwise, use values hard coded in the example

  return (
    <Container maxWidth={'l'} sx={{backgroundColor: '#000000' }}>
      <Header />
      <Grid container spacing={0} sx={{ display: 'flex', justifyContent: 'center' }}>
        {/* This is a template for the ground station. Will need to be adapted as components are added */}
        <Grid item sx={2}>
          <List>
            <ListItem>
              <Box sx={{ display: 'flex', justifyContent: 'center', width: 520, height: 340, backgroundColor: '#777772', borderRadius: '16px'}}>
                Example section
              </Box>
            </ListItem>
            <ListItem>
              <Box sx={{ display: 'flex', justifyContent: 'center', width: 520, height: 340, backgroundColor: '#777772', borderRadius: '16px'}}>
                Example section
              </Box>
            </ListItem>
          </List>
        </Grid>
        <Grid item sx={2}>
          <List>
            <ListItem>
              <Box sx={{ display: 'flex', justifyContent: 'center', width: 260, height: 258, backgroundColor: '#777772', borderRadius: '16px'}}>
                Example section
              </Box>
            </ListItem>
            <ListItem>
              <Altimeter
              telemetry={telemetry} />
            </ListItem>
            <ListItem>
              <Box sx={{ display: 'flex', justifyContent: 'center', width: 260, height: 148, backgroundColor: '#777772', borderRadius: '16px'}}>
                Example section
              </Box>
            </ListItem>
          </List>
        </Grid>
        <Grid item sx={2}>
          <List>
            <ListItem>
              <Status
              telemetryStatus ={telemetry}/>
            </ListItem>
            <ListItem>
              <Box sx={{ display: 'flex', justifyContent: 'center', width: 520, height: 216, backgroundColor: '#777772', borderRadius: '16px'}}>
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
