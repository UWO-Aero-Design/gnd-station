import { Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import * as React from 'react';

function Status() {

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
        </Box>
    )
}

export default Status;