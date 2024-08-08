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
import FiltroFlete from './FiltroFlete';
import TablaFlete from './TablaFlete';
import { ProveedoresFleteCedulaAtom } from '../atoms/ProveedorFleteCedula';
import { DataFleteAtom, DataFleteJsonAtom} from '../atoms/DataFleteAtom';
import ExportarFletePDF from './ExportarFletePDF';
import ExportarExcelFlete from './ExportarExcelFlete';

export default function ReportesFlete() {

  const [valueActivo, setValueActivo] = React.useState('todo');
  const proveedores = useAtomValue(ProveedoresFleteCedulaAtom)
  const fechaFin = useAtomValue(fechaFinAtom);
  const fechaInicio = useAtomValue(fechaInicioAtom);
  const [fleteData, setFleteData] = useAtom(DataFleteAtom)
  const fleteDataJson = useAtomValue(DataFleteJsonAtom);

  const handleChangeActivo = (event) => {
    setValueActivo(event.target.value);
  };

  function handleClick() {
    setFleteData([]);

    let proveedorStatusQuery = "";
    let proveedorStatusValue = valueActivo;
    let proveedorQuery = ""

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
    console.log(proveedoresStringifycados, 'proveedoresStringifycados')

   if (proveedoresStringifycados.length > 0){
     proveedorQuery = `SOPERACIONINV.FTI_RESPONSABLE IN (${proveedoresStringifycados.join(",")}) AND`
   }

    console.info({
      fechaInicio: fechaInicio.format('DD-MM-YYYY'),
      fechaFin: fechaFin.format('DD-MM-YYYY'),
      proveedorStatusQuery: proveedorStatusQuery,
      proveedorQuery: proveedorQuery,
      proveedores: proveedores,
    });

    window.api.getFlete({
      fechaInicio: fechaInicio.format('YYYY-MM-DD'),
      fechaFin: fechaFin.format('YYYY-MM-DD'),
      proveedorStatusQuery: proveedorStatusQuery,
      proveedorQuery: proveedorQuery,
    }).then((result) => {
      let placas = {}
      let datosSinprocesar = result
      result.forEach((row) => {
        placas[row[3]] = null
      });

      let placasArray = Object.keys(placas)
      let placaQuery= ''
      console.log(datosSinprocesar, 'data')
      console.log(placasArray, 'placasarray')

      let placasStringifycados = []
  
        placasArray.forEach((placa) => {
          if(placa != 'None'){
            placasStringifycados.push(`'${placa}'`)
          }
        });

      if (placasStringifycados.length > 0) {

        console.log(placasStringifycados, 'placasStringifycados')
        placaQuery = `CODIGO IN (${placasStringifycados.join(",")})`

        window.api.getPlacasReporteFlete({
          placaQuery: placaQuery
        }).then((result) => {
          result.forEach((row) => {
            placas[row[0]] = row[1]
          })

          console.log(result, 'placa')

          let resultProcesado = []
          datosSinprocesar.forEach((row) => {
            resultProcesado.push({
              placa: placas[row[3]],
              fecha: dayjs(row[0]).format('DD-MM-YYYY'),
              fletero: row[1],
              chofer: row[2],
              documento: row[4],
              ruta: row[5],
              cantidadViajes: row[6],
              precio: row[7],
              totalOperacion: row[8]
            })
          });
          setFleteData(resultProcesado)
        })
      }else{
        let resultProcesado = []
        datosSinprocesar.forEach((row) => {
          resultProcesado.push({
            placa: placas[row[3]],
            fecha: dayjs(row[0]).format('DD-MM-YYYY'),
            fletero: row[1],
            chofer: row[2],
            documento: row[4],
            ruta: row[5],
            cantidadViajes: row[6],
            precio: row[7],
            totalOperacion: row[8]
          })
        });
        setFleteData(resultProcesado)
      }
    })
  }

  return(
    <Box width={'85%'} sx={{mt: 10}}>
      <Box maxHeight={'100px'}>
        <FiltroFlete/>
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
          <ExportarExcelFlete data = {fleteDataJson}/>
          <ExportarFletePDF data = {fleteDataJson}/>
        </Stack>

        <FormControl
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
        </FormControl>
      </Box>
      <TablaFlete />
      <HotKey/>
    </Box>
  );
}