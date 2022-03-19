import * as React from 'react';
import { Container, Grid, Box, ListItem, List } from '@mui/material';
import Header from './components/Header';
import Servo from './components/Servo';
import Status from './components/Status';
import Altimeter from './components/Altimeter';

function App() {

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
              <Altimeter />
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
              <Status/>
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
