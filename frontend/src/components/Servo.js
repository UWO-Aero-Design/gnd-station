import { Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import * as React from 'react';
import Button from './Button';

function Servo() {

    //TODO: Replace the hard-coded select box values with a JSON file

    const [servoNum, setServoNum] = React.useState('');

    const handleChange = (event) => {
        setServoNum(event.target.value);
    };

    return(
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', height: '30vh', backgroundColor: '#777772', borderRadius: '16px'}}>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 250 }}>
                <InputLabel id="servo-box">Select Servo</InputLabel>
                <Select
                    labelId="servo-box"
                    id="servo-box"
                    value={servoNum}
                    onChange={handleChange}
                    label="Servo"
                >
                    <MenuItem value="">
                        <em>Select Servo</em>
                    </MenuItem>
                    <MenuItem value={1}>Servo 1</MenuItem>
                    <MenuItem value={2}>Servo 2</MenuItem>
                    <MenuItem value={3}>Servo 3</MenuItem>
                </Select>
                <Button  Style = {{height: 35,width: 200, position: 'absolute', marginTop: '50%',
                                marginRight:'60%', display: 'inline-block'}} 
                                ButtonText = {`Upload Settings (${servoNum})`}
                                BackgroundColor ='#00FF00' />
                                
                <Button Style = {{height: 35 ,width: 150, position: 'absolute', marginTop: '50%',
                                marginLeft:'100%', borderRadius:'7px', display: 'flex'}}
                                 ButtonText = 'Reset'/>
            </FormControl>
        </Box>
    )
}

export default Servo;