import * as React from 'react';
import { Box, AppBar, Typography } from '@mui/material';

function Header() {
    return(
        <Box sx={{ flexGrow: 1, backgroundColor: '#777772' }}>
            <AppBar position="static">
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Western Aero Design Team - Ground Station
                </Typography>
            </AppBar>
        </Box>
    )
}

export default Header;