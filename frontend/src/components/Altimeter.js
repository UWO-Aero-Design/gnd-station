import { Typography, Box, List, Grid, ListItem } from '@mui/material';
import Brightness1Icon from '@mui/icons-material/Brightness1';
import React from 'react';
import Button from "./Button";

// #00e676 #00c853
const MAX_ALTITUDE = 50;
const GREEN = '#00e676';
const RED = '#ff1744';

function Altimeter({telemetry, dropCommand, resetCommand}) {
    let alt = telemetry?.enviro?.altitude;

    // Declare altitude variable outside to be able to restrain it to 2 decimals per
    let altDisplay = (telemetry === undefined) ? '---' : parseFloat(alt).toFixed(2);

    // const [dropped, setDropped] = React.useState(false);
    const [dropHeight, setDropHeight] = React.useState(null);

    //has to be declared before using it in background colour below
const canDrop = () => {
    return alt <= MAX_ALTITUDE;
}

    const background = canDrop() ?  GREEN : RED;
    
    
    const drop = () => {
        setDropHeight(altDisplay);
        // setDropped(true);
        dropCommand();
    }

    const reset = () => {
        setDropHeight(null);
        // setDropped(false);
        resetCommand();
    }
    
    

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', height: '35vh', backgroundColor: '#777772', borderRadius: '16px' }}>
            <List>
                <Typography align='center' lineHeight={0.5}>
                    <h3>
                        Altitude
                    </h3>
                    <h1>
                        { altDisplay } ft
                    </h1>
                    <h3>
                        PADA Drop Height
                    </h3>
                </Typography>
                <Grid container spacing={3} sx={{ display: 'flex' }}>
                    <Grid item sx={2}>
                        <Brightness1Icon sx={{ color: background }} />
                    </Grid>
                    <Grid item sx={4}>
                        <Typography align='center' lineHeight={0}>
                            <h1>
                                {dropHeight != null ? dropHeight : '----'} ft
                            </h1>
                        </Typography>
                    </Grid>
                </Grid>
                <ListItem sx={{m: 0}}>
                    <Button clickFn={drop} BackgroundColor = {background} ButtonText = "Drop Pada">
                    </Button>
                </ListItem>
                <ListItem>
                    <Button clickFn={reset} ButtonText = "Reset">
                    </Button>
                </ListItem>
            </List>
        </Box>
    )
}

export default Altimeter;