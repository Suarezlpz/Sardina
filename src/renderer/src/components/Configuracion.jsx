import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import CssBaseline from '@mui/material/CssBaseline';
import StorageIcon from '@mui/icons-material/Storage';
import TextField from '@mui/material/TextField';
export default function Configuracion() {

    return(
        <>
            <CssBaseline />
            <Container>
                <Box sx={{ bgcolor: '#cfe8fc', height: '85vh' }}>
                    <Grid container spacing={3}>
                        <Grid xs>
                          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <StorageIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                            <TextField id="input-with-sx" label="With sx" variant="standard" />
                          </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    );
}
