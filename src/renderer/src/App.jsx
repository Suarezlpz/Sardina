import ProductsTable from './components/ProductsTable'
import RangoFecha from './components/RangoFecha'
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import ExcelButton from './components/ExelButton';
import DrawerReporte from './components/Drawer';

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
    <CssBaseline />
    <Container maxWidth="sm">  
        {/*<ExcelButton/>
        <RangoFecha></RangoFecha>
        <ProductsTable/>*/}
        <DrawerReporte/>
    </Container>

    </>
  )
}

export default App

