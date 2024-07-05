import { useEffect, useState } from 'react'
import * as React from 'react';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid'
import ProductSumList from './ProductSumList';
import { useAtomValue, useAtom } from 'jotai'
import { fechaInicioAtom, fechaFinAtom } from '../atoms/RangoFecha'
import { productSumModalAtom } from '../atoms/ProductSumModal'
import {procesarDatosBiometricos} from '../services/ManipulacionDeExcel'
import { DatoBiometricoAtom } from '../atoms/DatoBiometrico';
import { DataProcesadaAtom } from '../atoms/DataProcesada';
import DataProcesadaModal from './DataProcesadaModal';
import PruebaModal from './PruebaModal';

function createData(id, name) {
  return { id, name }
}
export default function ProductsTable() {
  
  const [rows, setRows] = useState([]);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [productSumModal, setProductSumModal] = useAtom(productSumModalAtom)
  const fechaInicio = useAtomValue(fechaInicioAtom)
  const fechaFin = useAtomValue(fechaFinAtom)
  const [open, setOpen] = useState(false);
  const [openDataProcesadaModal, setOpenDataProcesadaModal] = useState(false);
  const [openPruebaModal, setOpenPruebaModal] = useState(false);
  
  const [dataProcesada, setDataProcesada] = useAtom(DataProcesadaAtom)

  const datoBiometrico = useAtomValue(DatoBiometricoAtom);


  const columns = [
    { field: 'id', headerName: 'Codigo' },
    { field: 'name', headerName: 'Nombre' },
  ];
  
  useEffect(() => {

    let tempRows = []

    window.api.getProductsData().then((result) => {
      result.forEach((product) => {
        tempRows.push(createData(...product))
      })
      setRows(tempRows)
    })
  }, [])

  return (

    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
        rowSelectionModel={rowSelectionModel}
        {...rows}
      />

      <ProductSumList abrir={open} setOpen={setOpen} />
      <DataProcesadaModal abrir={openDataProcesadaModal} setOpen={setOpenDataProcesadaModal}/>
      <PruebaModal abrir={openPruebaModal} setOpen={setOpenPruebaModal} />

      <Button 
        variant="contained"
        sx={{marginTop: "5px"}}
        onClick={() => {

          setOpen(true);

          let codes = []

          rowSelectionModel.forEach((code) => {
            codes.push(`'${code}'`)
          });

          if (codes.length === 0) {
            return true
          }

          window.api.getProductsSum({
            fechaInicio: fechaInicio.format('YYYY-MM-DD') ,
            fechaFin: fechaFin.format('YYYY-MM-DD') ,
            codeString: codes.join(',')
          }).then((result) => {
            setProductSumModal(result)
            let datoProcesado = procesarDatosBiometricos(datoBiometrico, fechaInicio, fechaFin)
            console.log(datoProcesado)
            setDataProcesada(datoProcesado);
          })

        }}
      >
        Calcular Producción
      </Button>

      <Button
      sx={{marginTop: "5px", marginLeft: '5px'}}
      variant="contained"
      disabled = {dataProcesada == null? true : false}
      onClick={() =>{
        setOpenDataProcesadaModal(true);
      }}
      >
        Horas Trabajadas
      </Button>

      <Button
        sx={{marginTop: "5px", marginLeft: '5px'}}
        variant="contained"
        onClick={() =>{
          setOpenPruebaModal(true);
        }}
      >
        Modal
      </Button>

    </div>
  )
}
