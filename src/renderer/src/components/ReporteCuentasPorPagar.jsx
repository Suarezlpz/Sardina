import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { Button, Stack } from '@mui/material';
import { ZonasSeleccionadasAtom } from '../atoms/ZonasSeleccionadasAtom';
import { useAtom, useAtomValue } from 'jotai';
import { fechaInicioAtom, fechaFinAtom } from '../atoms/RangoFecha';
import dayjs from 'dayjs';
import TablaPorPagar from './TablaCuentasPorPagar';
import FiltroPorPagar from './FiltroPorPagar';
import { ProveedoresAtom } from '../atoms/ProveedoresAtom';
import { PorPagarAtom, PorPagarJsonAtom } from '../atoms/PorPagarAtom';
import ExportarExcel from './ExportarExcelPorPagar';
import ExportarPDFporPagar from './ExportarPDFporPagar';
import HotKey from './HotKey';


export default function CuentasPorPagar() {

  const fechaFin = useAtomValue(fechaFinAtom);
  const fechaInicio = useAtomValue(fechaInicioAtom);
  const zonasSeleccionadas = useAtomValue(ZonasSeleccionadasAtom);
  const proveedores = useAtomValue(ProveedoresAtom);
  const [porPagar, setPorPagar] = useAtom(PorPagarAtom);
  const porPagarJson = useAtomValue(PorPagarJsonAtom);

  function handleClick() {

    let zonaQuery = "";
    let proveedorQuery = "";

    if (proveedores.length > 0) {

      let proveedoresStringifycados = []

      proveedores.forEach((proveedor) => {
        proveedoresStringifycados.push(`'${proveedor}'`)
      });

      proveedorQuery = `SCUENTASXPAGAR.FCP_CODIGO IN (${proveedoresStringifycados.join(",")}) AND`
    }

    if(zonasSeleccionadas.length > 0) {

      let zonasStringifycadas = []
  
      zonasSeleccionadas.forEach((zona) => {
        zonasStringifycadas.push(`'${zona}'`)
      });
  
      zonaQuery = `SOPERACIONINV.FTI_NITCLIENTE IN (${zonasStringifycadas.join(",")}) AND`
    }

    console.info({
      fechaInicio: fechaInicio.format('YYYY-MM-DD'),
      fechaFin: fechaFin.format('YYYY-MM-DD'),
      zonaQuery: zonaQuery,
      proveedorQuery: proveedorQuery,
    });

    window.api.getCuentasPorPagarCuerpo({
      fechaInicio: fechaInicio.format('YYYY-MM-DD'),
      fechaFin: fechaFin.format('YYYY-MM-DD'),
      zonaQuery: zonaQuery,
      proveedorQuery: proveedorQuery
    }).then((result) => {
      let resultProcesado = []
      result.forEach((row) => {
          resultProcesado.push({
            fecha: dayjs(row[0]).format('DD-MM-YYYY'),
            ci: row[1],
            proveedor: row[2],
            id: row[3],
            montoOriginal: row[4],
            abono: row[5],
            zona: row[6].toUpperCase(),
            tipoTransaccion: row[7],
            ftiStatus: row[8],
            statusCliente: row[9],
            fechaProx: row[10],
          })
      })
      setPorPagar(resultProcesado);
    })
  }

  return(
    <Box width={'85%'} sx={{mt: 10}}>
      <Box maxHeight={'100px'}>
        <FiltroPorPagar/>
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
          <ExportarExcel  data={porPagarJson}/>
          <ExportarPDFporPagar data={porPagarJson}/>
        </Stack>
      </Box>
      <TablaPorPagar/>
      <HotKey/>
    </Box>
  );
}
