import { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { useAtomValue, useAtom } from 'jotai'
import "./PreliminarModel.css"
import { MaterialReactTable } from 'material-react-table';
import { PorPagarAtom } from '../atoms/PorPagarAtom';


const columns = ([
  {
    accessorKey: 'fecha',
    header: 'Fecha',
    grow: false, //don't allow this column to grow to fill in remaining space - new in v2.8
    size: 50, //small column
  },
  {
    accessorKey: 'proveedor',
    header: 'Proveedor',
    grow: false,
    size: 50,
  },
  {
    accessorKey: 'id',
    header: 'FTI_Documento',
    grow: false,
    size: 50,
  },
  {
    accessorKey: 'montoOriginal',
    header: 'Monto Original',
    grow: false,
    size: 50,
  },
  {
    accessorKey: 'abono',
    header: 'Saldo Pendiente',
    grow: false,
    size: 50,
  },
 
  {
    accessorKey: 'zona',
    header: 'Zona',
    grow: false, //don't allow this column to grow to fill in remaining space - new in v2.8
    size: 50, //small column
  },
  {
    accessorKey: 'fechaProx',
    header: 'Proxima Fecha',
    grow: false, //don't allow this column to grow to fill in remaining space - new in v2.8
    size: 50, //small column
  }
]);


export default function TablaPorPagar() {

  const porPagar = useAtomValue(PorPagarAtom);

  const rows = porPagar;
  var groups = Object.groupBy(rows, ({ fecha }) => fecha);
  var groupsPrecessed = Object.entries(groups).map(([k, v]) => {

    var groupsByProveedor = Object.groupBy(v, ({ proveedor }) => proveedor);

    let subRows = Object.entries(groupsByProveedor).map(([k2, v2]) => {

          return ({
            proveedor: k2,
            montoOriginal: v2.montoOriginal,
            abono: v2.abono,
            subRows: v2.map((v3) => ({
                id: v3.id,
                montoOriginal: v3.montoOriginal,
                abono: v3.abono,
                fechaProx: v3.fechaProx,
                zona: v3.zona
            }))
          })
    })

    return ({
      fecha: v[0].fecha,
      subRows: subRows
    } )
  })

  return (
    <Box sx={{ height: '500px', minWidth: '75vw' }}>
      <MaterialReactTable
        enableFilters={false}
        enableDensityToggle = {false}
        initialState={{density:'compact'}}
        enableExpanding= {true}
        columns={columns}
        data={groupsPrecessed}
        getSubRows={(originalRow) => originalRow.subRows}
        muiTableContainerProps={ {sx: { maxHeight: 400 }} }
        paginateExpandedRows={false}
      />
    </Box>
  );
}
