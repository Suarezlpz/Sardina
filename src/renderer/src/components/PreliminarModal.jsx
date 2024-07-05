import { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { DataGrid } from '@mui/x-data-grid';
import { useAtomValue, useAtom } from 'jotai'
import { DatosProcesadosAtom } from '../atoms/DatosProcesadosAtom';


const columns = [
    { 
        field: 'fecha', 
        headerName: 'Fecha', 
        width: 90 
    },
    { 
        field: 'proveedor', 
        headerName: 'Proveedor', 
        width: 90 
    },
    { 
        field: 'id', 
        headerName: 'FTI_Documento', 
        width: 90 
    },
    { 
        field: 'total', 
        headerName: 'Total', 
        width: 90 
    },
    { 
        field: 'producto', 
        headerName: 'Producto', 
        width: 90 
    },
    {
      field: 'cantidad',
      headerName: 'FDI_Cantidad',
      width: 90
    },
    {
      field: 'precio',
      headerName: 'Precio',
      width: 90
    },
    {
      field: 'totalOperacion',
      headerName: 'Total_Operacion',
      width: 90
    },
    {
      field: 'zona',
      headerName: 'Zona',
      width: 90,
    },
  ];

export default function PreliminarModal({abrir = false, setOpen}) {
  const datoProcesado = useAtomValue(DatosProcesadosAtom)
  const handleClose = () => setOpen(false);

  const rows = datoProcesado;

  return (
  
        <Box>
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                    pagination: {
                        paginationModel: {
                        pageSize: 5,
                        },
                    },
                    }}
                    pageSizeOptions={[5]}
                    checkboxSelection
                    disableRowSelectionOnClick
                />
            </Box>
          
          {/*<Button variant="text"
            onClick={() => handleClose()}
          >Cerrar</Button>*/}
        </Box>
  );
}