import * as React from 'react';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Button, Stack } from '@mui/material';
import FiltroModal from './FiltroModal';
import { ZonasSeleccionadasAtom } from '../atoms/ZonasSeleccionadasAtom';
import { useAtom, useAtomValue } from 'jotai';
import { ProveedoresAtom } from '../atoms/ProveedoresAtom';
import { MateriaPrimaAtom } from '../atoms/MateriaPrimaAtom';
import PreliminarModal from './PreliminarModal';
import { DatosProcesadosAtom } from '../atoms/DatosProcesadosAtom';
import { fechaInicioAtom, fechaFinAtom } from '../atoms/RangoFecha';
import dayjs from 'dayjs';


export default function Reportes() {

  const [valueActivo, setValueActivo] = React.useState('todo');
  const zonasSeleccionadasAtom = useAtomValue(ZonasSeleccionadasAtom)
  const [zonas, setZonas] = useAtom(ZonasSeleccionadasAtom)
  const proveedores = useAtomValue(ProveedoresAtom)
  const [proveedoresAtom , setProveedoresAtom] = useAtom(ProveedoresAtom)
  const materiaPrima = useAtomValue(MateriaPrimaAtom)
  const [materiaPrimaAtom , setMateriaPrimaAtom] = useAtom(MateriaPrimaAtom)

  const [datosProcesado, setDatosProcesados] = useAtom(DatosProcesadosAtom)

  const fechaFin = useAtomValue(fechaFinAtom);
  const fechaInicio = useAtomValue(fechaInicioAtom);

  const handleChangeActivo = (event) => {
    setValueActivo(event.target.value);
  };

  return(
    <Box width={'85%'} sx={{mt: 10}}>
      <Box maxHeight={'100px'}>
        <FiltroModal/>
      </Box>
      <Box maxHeight={'100px'} display={'flex'}>
        <Stack spacing={1} direction={"row"} maxWidth={'300px'}>
          <Button
          sx={{height: 40}}
          variant="contained"
          onClick={() =>{
            let zonaQuery = "";
            let zonasSeleccionadas = zonasSeleccionadasAtom;
            let proveedorStatusQuery = "";
            let proveedorStatusValue = valueActivo;
            let proveedorQuery = ""
            let materiaPrimaQuery = ""

            if(zonasSeleccionadas.length > 0) {

              let zonasStringifycadas = []

              zonasSeleccionadas.forEach((zona) => {
                zonasStringifycadas.push(`'${zona}'`)
              });

              zonaQuery = `SOPERACIONINV.FTI_NITCLIENTE IN (${zonasStringifycadas.join(",")}) AND`
            }

            if (proveedorStatusValue === 'si') {
              proveedorStatusQuery = "SPROVEEDOR.FP_STATUS = 1 AND"
            }

            if (proveedorStatusValue === 'no') {
              proveedorStatusQuery = "SPROVEEDOR.FP_STATUS = 0 AND"
            }

            if (proveedores.length > 0) {

              let proveedoresStringifycados = []

              proveedores.forEach((proveedor) => {
                proveedoresStringifycados.push(`'${proveedor}'`)
              });

              proveedorQuery = `SOPERACIONINV.FTI_RESPONSABLE IN (${proveedoresStringifycados.join(",")}) AND`
            }

            if (materiaPrima.length > 0) {

              let materiasPrimasStringifycados = []

              materiaPrima.forEach((materia) => {
                materiasPrimasStringifycados.push(`'${materia}'`)
              });

              materiaPrimaQuery = `SDETALLECOMPRA.FDI_CODIGO IN (${materiasPrimasStringifycados.join(",")}) AND`
            }

            console.info({
              fechaInicio: fechaInicio.format('YYYY-MM-DD'),
              fechaFin: fechaFin.format('YYYY-MM-DD'),
              zonaQuery: zonaQuery,
              proveedorStatusQuery: proveedorStatusQuery,
              proveedorQuery: proveedorQuery,
              materiaPrimaQuery: materiaPrimaQuery
            });

            window.api.getReporteMateriaPrima({
              fechaInicio: fechaInicio.format('YYYY-MM-DD'),
              fechaFin: fechaFin.format('YYYY-MM-DD'),
              zonaQuery: zonaQuery,
              proveedorStatusQuery: proveedorStatusQuery,
              proveedorQuery: proveedorQuery,
              materiaPrimaQuery: materiaPrimaQuery
            }).then((result) => {
              let resultProcesado = []
              result.forEach((row) => {
                resultProcesado.push({
                  fecha: dayjs(row[0]).format('YYYY-MM-DD'),
                  proveedor: row[1],
                  id: row[2],
                  total: row[3],
                  producto: row[4],
                  cantidad: row[5],
                  precio: row[6],
                  totalOperacion: row[7],
                  zona: row[8],
                })
              });
              console.log(result, resultProcesado)
              setDatosProcesados(resultProcesado)
            })
          }}
          >Filtrar</Button>
          <Button
          sx={{height: 40}}
          variant="contained">Exportar</Button>
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
      <PreliminarModal />
    </Box>
  );
}
