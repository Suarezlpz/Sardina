import * as React from 'react';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RangoFecha from './RangoFecha';
import { Button, Stack } from '@mui/material';
import FiltroModal from './FiltroModal';
import { ZonasSeleccionadasAtom } from '../atoms/ZonasSeleccionadasAtom';
import { useAtom, useAtomValue } from 'jotai';
import { ProveedoresAtom } from '../atoms/ProveedoresAtom';
import { MateriaPrimaAtom } from '../atoms/MateriaPrimaAtom';
import PreliminarModal from './PreliminarModal';
import { DatosProcesadosAtom } from '../atoms/DatosProcesadosAtom';


export default function Reportes() {

    const [valueActivo, setValueActivo] = React.useState('si');
    const [valueOrden, setValueOrden] = React.useState('cedula');
    const [openFiltroModal, setOpenFiltroModal] = React.useState(false);
    const [openPreliminarModal, setOpenPreliminarModal] = React.useState(false);
    const zonasSeleccionadasAtom = useAtomValue(ZonasSeleccionadasAtom)
    const proveedores = useAtomValue(ProveedoresAtom)
    const materiaPrima = useAtomValue(MateriaPrimaAtom)
    const [datosProcesado, setDatosProcesados] = useAtom(DatosProcesadosAtom)

  const handleChangeOrden = (event) => {
    setValueOrden(event.target.value);
  };

  const handleChangeActivo = (event) => {
    setValueActivo(event.target.value);
  };

    return(
        <>
        <Box width={'100%'} display={'flex'}>
            <Box width={'50%'}>
                <FormControl
                    fullWidth
                    sx={{display: 'flex'}}>
                    <FormLabel id="demo-controlled-radio-buttons-group">Activo</FormLabel>
                    <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={valueActivo}
                    onChange={handleChangeActivo}
                    >
                    <FormControlLabel value="si" control={<Radio />} label="Si" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                    <FormControlLabel value="todo" control={<Radio />} label="Todo" />
                    </RadioGroup>
                </FormControl>
                <FormControl>
                    <FormLabel id="demo-controlled-radio-buttons-group">Orden del Reporte</FormLabel>
                    <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={valueOrden}
                    onChange={handleChangeOrden}
                    >
                    <FormControlLabel value="cedula" control={<Radio />} label="Cedula" />
                    <FormControlLabel value="factura" control={<Radio />} label="Factura" />
                    <FormControlLabel value="a-z" control={<Radio />} label="A - Z" />
                    </RadioGroup>
                </FormControl>
            </Box>
            <Box width={'50%'}>
                <Stack spacing={1} justifyContent={'center'}>
                    <Button
                    variant="contained"
                    onClick={() =>{
                      let zonaQuery = "";
                      let zonasSeleccionadas = zonasSeleccionadasAtom;
                      let proveedorStatusQuery = "";
                      let proveedorStatusValue = "";
                      let proveedorQuery = ""
                      let materiaPrimaQuery = ""

                      if(zonasSeleccionadas.length > 1) {

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
                    
                      if (proveedores.length > 1) {

                        let proveedoresStringifycados = []

                        proveedores.forEach((proveedor) => {
                          proveedoresStringifycados.push(`'${proveedor}'`)
                        });

                        proveedorQuery = `SOPERACIONINV.FTI_RESPONSABLE IN (${proveedoresStringifycados.join(",")}) AND`
                      }

                      if (materiaPrima.length > 1) {

                        let materiasPrimasStringifycados = []

                        materiaPrima.forEach((materia) => {
                          materiasPrimasStringifycados.push(`'${materia}'`)
                        });

                        materiaPrimaQuery = `SDETALLECOMPRA.FDI_CODIGO IN (${materiasPrimasStringifycados.join(",")}) AND`
                      }

                      window.api.getReporteMateriaPrima({
                        fechaInicio: '2024-01-01',
                        fechaFin: '2024-05-01',
                        zonaQuery: zonaQuery, 
                        proveedorStatusQuery: proveedorStatusQuery, 
                        proveedorQuery: proveedorQuery,
                        materiaPrimaQuery: materiaPrimaQuery
                      }).then((result) => {
                        console.log(result)
                        let resultProcesado = []
                        result.forEach((row) => {
                          resultProcesado.push({
                            fecha: row[0],
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
                        console.log(zonaQuery, proveedorStatusQuery, proveedorQuery, materiaPrima)
                        setDatosProcesados(resultProcesado)
                      
                      })

                      setOpenPreliminarModal(true);
                    }}
                    >Preliminar</Button>
                    <Button
                    variant="contained">Impresora</Button>
                    <Button
                    variant="contained">Exportar</Button>
                </Stack>
                <FormControl sx={{display: 'flex', marginTop: '15px'}}>
                    <FormLabel>Emision del documento</FormLabel>
                    <RangoFecha/>
                </FormControl>
            </Box>
      </Box>
      <Stack spacing={2} justifyContent={'center'} direction={'row'}>
        <Button
        variant="contained"
        onClick={() =>{
          setOpenFiltroModal(true);
        }}>Filtro</Button>
        <Button
        variant="contained">Salir</Button>
      </Stack>
    <FiltroModal abrir={openFiltroModal} setOpen={setOpenFiltroModal}/>
    <PreliminarModal abrir={openPreliminarModal} setOpen={setOpenPreliminarModal}/>
    </>
    );
}