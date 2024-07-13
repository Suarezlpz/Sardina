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
          display={'flex'}
          justifyContent="space-between"
          mb={2}
        >
          <DatePicker
            sx={{
              m: 1, 
              minWidth: '150px'
            }}
            label="Desde"
            value={inicioFecha}
            onChange={(newValue) =>{
            setInicioFecha(newValue)
          }}
          />
          <DatePicker
            sx={{m: 1,
              minWidth: '150px'
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
  