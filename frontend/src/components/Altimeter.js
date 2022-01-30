import { Typography, Box, List, Grid, Button, ListItem } from '@mui/material';
import Brightness1Icon from '@mui/icons-material/Brightness1';
import * as React from 'react';

// #00e676 #00c853

function Altimeter() {

    const dropHeight = 420.69;
    const background = CanDrop(dropHeight)? '#00e676':'#ff1744';
    const hover = CanDrop(dropHeight)? '#00c853':'#b2102f';

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
                <ListItem>
                    <Button variant='contained' sx={{ width: 200, height: 30, backgroundColor: background, '&:hover': { backgroundColor: hover } }}>
                        Drop Pada
                    </Button>
                </ListItem>
                <ListItem>
                    <Button variant='contained' sx={{ width: 200, height: 30 }}>
                        Reset
                    </Button>
                </ListItem>
            </List>
        </Box>
    )
}

function ReadAltitude() {
    // This will be where the function occurs to read the altitude from the sensor
    // Can also be connected to a potential function for reading simulated altitude
    return 12.69;
}

function CanDrop(dropHeight) {
    if (ReadAltitude() > dropHeight) {
        return true;
    } else {
        return false;
    }
}

export default Altimeter;