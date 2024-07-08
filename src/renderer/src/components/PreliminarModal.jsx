import { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { useAtomValue, useAtom } from 'jotai'
import { DatosProcesadosAtom } from '../atoms/DatosProcesadosAtom';
import "./PreliminarModel.css"
import { MaterialReactTable } from 'material-react-table';
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
  },
  {
    accessorKey: 'id',
    header: 'FTI_Documento',
    grow: false,
    size: 50,
  },
  {
    accessorKey: 'total',
    header: 'Total',
    grow: false,
    size: 100,
  },
  {
    accessorKey: 'producto',
    header: 'Producto',
    size: 100,
  },
  {
    accessorKey: 'cantidad',
    header: 'FDI_Cantidad',
    grow: false,
    size: 50,
  },
  {
    accessorKey: 'precio',
    header: 'Precio',
    grow: false,
    size: 100,
  },
  {
    accessorKey: 'totalOperacion',
    header: 'Total_Operacion',
    grow: false,
    size: 100,
  },
  {
    accessorKey: 'zona',
    header: 'Zona',
    grow: false, //don't allow this column to grow to fill in remaining space - new in v2.8
    size: 50, //small column
  }
]);

export default function PreliminarModal() {
  const rows = useAtomValue(DatosProcesadosAtom)
  var groups = Object.groupBy(rows, ({ fecha }) => fecha);
  var groupsPrecessed = Object.entries(groups).map(([k, v]) => {

    var groupsByProveedor = Object.groupBy(v, ({ proveedor }) => proveedor);

    let subRows = Object.entries(groupsByProveedor).map(([k2, v2]) => {

          return ({
            proveedor: k2,
            total: v2.reduce((acc, x) => acc + Number(x.total), 0),
            cantidad: v2.reduce((acc, x) => acc + Number(x.cantidad), 0),
            totalOperacion: v2.reduce((acc, x) => acc + Number(x.totalOperacion), 0),
            precio: v2.reduce((acc, x) => acc + Number(x.precio), 0),
            subRows: v2.map((v3) => ({
                id: v3.id,
                producto: v3.producto,
                total: v3.total,
                cantidad: v3.cantidad,
                totalOperacion: v3.totalOperacion,
                precio: v3.precio,
                zona: v3.zona
            }))
          })
    })

    return ({
      fecha: v[0].fecha,
      total: v.reduce((acc, x) => acc + Number(x.total), 0),
      cantidad: v.reduce((acc, x) => acc + Number(x.cantidad), 0),
      totalOperacion: v.reduce((acc, x) => acc + Number(x.totalOperacion), 0),
      precio: v.reduce((acc, x) => acc + Number(x.precio), 0),
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
      />
    </Box>
  );
}
