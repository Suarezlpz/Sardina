import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import DrawerReporte from './components/Drawer';

function App() {

  return (
    <>
    <CssBaseline />
    <Container maxWidth="sm">
        <DrawerReporte/>
    </Container>

    </>
  )
}

export default App
