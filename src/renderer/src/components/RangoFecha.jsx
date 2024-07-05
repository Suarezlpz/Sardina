import * as React from 'react';
import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useAtom } from 'jotai'
import { fechaInicioAtom, fechaFinAtom } from '../atoms/RangoFecha'


export default function RangoFecha() {

    const [inicioFecha, setInicioFecha] = useAtom(fechaInicioAtom)
    const [finalFecha, setFinalFecha] = useAtom(fechaFinAtom)
  
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          display={'grid'}
          gridTemplateColumns={'repeat(auto-fit, minmax(200px, 1fr))'}
          justifyContent="space-between"
          mb={2}
        >
          <DatePicker
            sx={{
              margin: 0.5
            }}
            label="Desde"
            value={inicioFecha}
            onChange={(newValue) =>{
            setInicioFecha(newValue)
          }}
          />
          <DatePicker
            sx={{
              margin: 0.5
            }}
            label="Hasta"
            value={finalFecha}
            onChange={(newValue) => {
            setFinalFecha(newValue)
          }}
          />
        </Box>
      </LocalizationProvider>
    );
  }
  