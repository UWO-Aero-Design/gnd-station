import { Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import React from 'react';
import Button from './Button';

function Status() {

    //Variables to hold each Port COM location

    const statusState = 'connected';
    const background = statusUpdate(statusState)? '#00e676':'#ff1744';
    const statusText = statusUpdate(statusState)? 'Connected' : 'Ready to Connect';

    function statusUpdate(status){
        return (status === 'connected')
    }
    //TODO: Replace the hard-coded select box values with a JSON file

    const [port, setPort] = React.useState('');

    const handleChange = (event) => {
        setPort(event.target.value);
    };

    return(
        <Box sx={{ display: 'flex', justifyContent: 'center', width: 520, height: 224, backgroundColor: '#777772', borderRadius: '16px'}}>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 250 }}>
                <InputLabel id="port-box">Select COM Port</InputLabel>
                <Select
                    labelId="port-box"
                    id="port-box"
                    value={port}
                    onChange={handleChange}
                    label="COM Port"
                >
                    <MenuItem value="">
                        <em>Select COM Port</em>
                    </MenuItem>
                    <MenuItem value={1}>Port 1</MenuItem>
                    <MenuItem value={2}>Port 2</MenuItem>
                    <MenuItem value={3}>Port 3</MenuItem>
                </Select>
            </FormControl>
            <Button BackgroundColor = {background} ButtonText = {statusText} 
            Style = {{display:'inline-box',width: '30%', height: '15%',position:'absolute', marginTop:'20px'}}
            />
        </Box>
        
        
    )
}

export default Status;