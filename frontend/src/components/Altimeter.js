import { Typography, Box, List, Grid, ListItem } from '@mui/material';
import Brightness1Icon from '@mui/icons-material/Brightness1';
import React from 'react';
import Button from "./Button";

// #00e676 #00c853

function Altimeter() {

    const [dropped, setDropped] = React.useState(false);
    const [dropHeight, setDropHeight] = React.useState(50);
    const [altitude, setAltitude] = React.useState();
    const background = CanDrop(dropHeight) ? '#ff1744' : '#00e676';
    // const hover = CanDrop(dropHeight) ?  '#b2102f' : '#00c853';

    React.useEffect(() => {
        setAltitude(ReadAltitude());
    });

    const drop = () => {
        if (altitude <= dropHeight) {
            setDropHeight(altitude);
            setDropped(true);
        }
    }

    const reset = () => {
        setDropHeight(50);
        setDropped(false);
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: 260, height: 258, backgroundColor: '#777772', borderRadius: '16px' }}>
            <List>
                <Typography align='center' lineHeight={0.5}>
                    <h3>
                        Altitude
                    </h3>
                    <h1>
                        {altitude} ft
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
                                {dropped ? dropHeight : '----'} ft
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

function ReadAltitude() {
    // This will be where the function occurs to read the altitude from the sensor
    // Can also be connected to a potential function for reading simulated altitude
    return 40;
}

function CanDrop(dropHeight) {
    return (ReadAltitude() >= dropHeight)   
}

export default Altimeter;