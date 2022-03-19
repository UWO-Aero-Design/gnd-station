import { Typography, Box, List, Grid, ListItem } from '@mui/material';
import Brightness1Icon from '@mui/icons-material/Brightness1';
import React from 'react';
import Button from "./Button";

// #00e676 #00c853

function Altimeter() {

    const dropHeight = 400.15;
    const background = CanDrop(dropHeight)? '#00e676':'#ff1744';
   // const hover = CanDrop(dropHeight)? '#00c853':'#b2102f';
    

    return(
        <Box sx={{ display: 'flex', justifyContent: 'center', width: 260, height: 258, backgroundColor: '#777772', borderRadius: '16px'}}>
            <List>
                <Typography align='center' lineHeight={0.5}>
                    <h3>
                        Altitude
                    </h3>
                    <h1>
                        {ReadAltitude()} ft
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
                                {dropHeight} ft
                            </h1>
                        </Typography>
                    </Grid>
                </Grid>
                <ListItem sx={{m: 0}}>
                    <Button BackgroundColor = {background} ButtonText = "Drop Pada">
                    </Button>
                </ListItem>
                <ListItem>
                    <Button ButtonText = "Reset">
                    </Button>
                </ListItem>
            </List>
        </Box>
    )
}

function ReadAltitude() {
    // This will be where the function occurs to read the altitude from the sensor
    // Can also be connected to a potential function for reading simulated altitude
    return 1500;
}

function CanDrop(dropHeight) {
    return (ReadAltitude() > dropHeight)   
}

export default Altimeter;