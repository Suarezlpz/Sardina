import * as React from 'react';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Button, Stack } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import { ProveedoresAtom } from '../atoms/ProveedoresAtom';
import { fechaInicioAtom, fechaFinAtom } from '../atoms/RangoFecha';
import dayjs from 'dayjs';
import HotKey from './HotKey';
import RangoFecha from './RangoFecha';
import TablaDetalleDeVenta from './TablaDetalleDeVenta';
import { ProveedoresFleteCedulaAtom } from '../atoms/ProveedorFleteCedula';
import { DataDetalleDeVentaAtom, DataDetalleDeVentaJsonAtom } from '../atoms/DataDetalleDeVentaAtom';
import ExportarExcelDetalleDeVenta from './ExportarExcelDetalleDeVenta';
import { MateriaPrimaFleteAtom } from '../atoms/MateriaPrimaAtom';

export default function ReporteDetalleDeVenta() {

  const [valueActivo, setValueActivo] = React.useState('todo');
  const proveedores = useAtomValue(ProveedoresFleteCedulaAtom)
  const fechaFin = useAtomValue(fechaFinAtom);
  const fechaInicio = useAtomValue(fechaInicioAtom);
  const [detalleDeventaData, setDetalleDeventaData] = useAtom(DataDetalleDeVentaAtom)
  const detallesDeVentaDataJson = useAtomValue(DataDetalleDeVentaJsonAtom);
  const materiaPrima = useAtomValue(MateriaPrimaFleteAtom);


  /*const handleChangeActivo = (event) => {
    setValueActivo(event.target.value);
  };*/

  function handleClick() {
    setDetalleDeventaData([]);

    /*let proveedorStatusQuery = "";
    let proveedorStatusValue = valueActivo;
    let proveedorQuery = ""
    let materiaPrimaQuery = ""

    if (proveedorStatusValue === 'si') {
      proveedorStatusQuery = "SPROVEEDOR.FP_STATUS = 1 AND"
    }

    if (proveedorStatusValue === 'no') {
      proveedorStatusQuery = "SPROVEEDOR.FP_STATUS = 0 AND"
    }


    let proveedoresStringifycados = []

    proveedores.forEach((proveedor) => {
      if(proveedor == ''){
        return
      }
      proveedoresStringifycados.push(`'${proveedor}'`)
    });

   if (proveedoresStringifycados.length > 0){
     proveedorQuery = `SOPERACIONINV.FTI_RESPONSABLE IN (${proveedoresStringifycados.join(",")}) AND`
   }

   if (materiaPrima.length > 0) {

    let materiasPrimasStringifycados = []

    materiaPrima.forEach((materia) => {
      materiasPrimasStringifycados.push(`'${materia}'`)
    });
    materiaPrimaQuery = `SDETALLECOMPRA.FDI_CODIGO IN (${materiasPrimasStringifycados.join(",")}) AND`
    }*/

    console.info({
      fechaInicio: fechaInicio.format('DD-MM-YYYY'),
      fechaFin: fechaFin.format('DD-MM-YYYY'),
      /*proveedorStatusQuery: proveedorStatusQuery,
      proveedorQuery: proveedorQuery,
      proveedores: proveedores,
      materiaPrimaQuery: materiaPrimaQuery,*/
    });

    window.api.getDetallesDeVenta({
      fechaInicio: fechaInicio.format('YYYY-MM-DD'),
      fechaFin: fechaFin.format('YYYY-MM-DD'),
    }).then((result) => {
      let resultProcesado = []
      result.forEach((row) => {
        resultProcesado.push({
          fecha: dayjs(row[0]).format('DD/MM/YYYY'),
          documento: row[1],
          producto: row[2],
          id: row[3],
          precio: row[4],
          cantidad: row[5],
          total: row[6],
          cedula: row[7],
        })
      });
      setDetalleDeventaData(resultProcesado)
      
      console.log(detalleDeventaData, 'detalleDeventaData')
      
    })
  }

  return(
    <Box width={'85%'} sx={{mt: 10}}>
      <Box maxHeight={'100px'} maxWidth={'300px'}>
        <RangoFecha/>
      </Box>
      <Box maxHeight={'100px'} display={'flex'}>
        <Stack spacing={1} direction={"row"} maxWidth={'300px'}>
          <Button
          sx={{height: 40}}
          variant="contained"
          onClick={() =>{
            handleClick();
          }}
          >Filtrar</Button>
          <ExportarExcelDetalleDeVenta data = {detallesDeVentaDataJson}/>
        </Stack>

        {/*<FormControl
          sx={{display: 'flex', flexDirection: 'row', maxWidth: '500px'}}>
          <FormLabel id="demo-controlled-radio-buttons-group" sx={{marginTop: 1, marginBottom: 4, marginLeft: 5, marginRight: 5}}>Proveedor Activo</FormLabel>
          <RadioGroup
          sx={{flexDirection: 'row', height: 40}}
          value={valueActivo}
          onChange={handleChangeActivo}
          >
          <FormControlLabel value="si" label="Si" control={<Radio />}  />
          <FormControlLabel value="no" control={<Radio />} label="No" />
          <FormControlLabel value="todo" control={<Radio />} label="Todo" />
          </RadioGroup>
        </FormControl>*/}
      </Box>
      <TablaDetalleDeVenta/>
      <HotKey/>
    </Box>
  );
}