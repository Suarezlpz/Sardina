import { useEffect, useState, useMemo } from 'react'
import Box from '@mui/material/Box';
import { useAtomValue, useAtom } from 'jotai'
import { DatosProcesadosAtom } from '../atoms/DatosProcesadosAtom';
import "./PreliminarModel.css"
import { MaterialReactTable } from 'material-react-table';

const columns = useMemo([
  {
    accessorKey: 'fecha',
    header: 'Fecha',
  },
  {
    accessorKey: 'proveedor',
    header: 'Proveedor',
  },
  {
    accessorKey: 'id',
    header: 'FTI_Documento',
  },
  {
    accessorKey: 'total',
    header: 'Total',
  },
  {
    accessorKey: 'producto',
    header: 'Producto',
  },
  {
    accessorKey: 'cantidad',
    header: 'FDI_Cantidad',
  },
  {
    accessorKey: 'precio',
    header: 'Precio',
  },
  {
    accessorKey: 'totalOperacion',
    header: 'Total_Operacion',
  },
  {
    accessorKey: 'zona',
    header: 'Zona',
  }
]);

export default function PreliminarModal() {
  const rows = useAtomValue(DatosProcesadosAtom)
  var groups = Object.groupBy(rows, ({ proveedor, fecha, id }) => proveedor + fecha + id);
  var groupsPrecessed = Object.entries(groups).map(([k, v]) => {
    return ({
      fecha: v[0].fecha,
      proveedor: v[0].proveedor,
      id: v[0].id,
      total: v.reduce((acc, x) => acc + Number(x.total), 0),
      cantidad: v.reduce((acc, x) => acc + Number(x.cantidad), 0),
      totalOperacion: v.reduce((acc, x) => acc + Number(x.totalOperacion), 0),
      precio: v.reduce((acc, x) => acc + Number(x.precio), 0),
      subRows: v
    })
  })

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <MaterialReactTable
        columns={columns}
        data={groupsPrecessed}
        enableExpanding
        getSubRows={(originalRow) => originalRow.subRows}
      />
    </Box>
  );
}