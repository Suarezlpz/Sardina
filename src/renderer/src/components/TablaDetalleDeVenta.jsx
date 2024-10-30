import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useAtomValue, useAtom } from 'jotai';
import { MaterialReactTable } from 'material-react-table';
import { DataDetalleDeVentaAtom, DataDetalleDeVentaJsonAtom } from '../atoms/DataDetalleDeVentaAtom';
import _ from 'lodash';


const columns = ([
  {
    accessorKey: 'fecha',
    header: 'FECHA',
    grow: false, //don't allow this column to grow to fill in remaining space - new in v2.8
    size: 50, //small column
  },
  {
    accessorKey: 'cedula',
    header: 'CEDULA',
    grow: false,
    size: 50,
  },
  {
    accessorKey: 'documento',
    header: 'DOCUMENTO',
    grow: false,
    size: 50,
  },
  {
    accessorKey: 'id',
    header: 'ID',
    grow: false,
    size: 50,
  },
  {
    accessorKey: 'producto',
    header: 'PRODUCTO',
    grow: false,
    size: 50,
  },
  {
    accessorKey: 'precio',
    header: 'PRECIO',
    grow: false,
    size: 50,
  },
  {
    accessorKey: 'cantidad',
    header: 'CANTIDAD',
    grow: false, //don't allow this column to grow to fill in remaining space - new in v2.8
    size: 50, //small column
  },
  {
    accessorKey: 'total',
    header: 'TOTAL',
    grow: false, //don't allow this column to grow to fill in remaining space - new in v2.8
    size: 50, //small column
  },
]);


export default function TablaDetalleDeVenta() {

  const dataDetalleDeVentaAtom = useAtomValue(DataDetalleDeVentaAtom);
  const [dataDetalleDeVentaJson, setDataDetalleDeVentaJson] = useAtom(DataDetalleDeVentaJsonAtom);
  const [groupsPrecessed, setGroupsPrecessed] = useState([]);
  console.log(dataDetalleDeVentaAtom, 'dataDetalleDeVentaAtom')

    useEffect(() => {
      const rows = dataDetalleDeVentaAtom;
      const groups = _.groupBy(rows, 'fecha');
      const processedGroups = Object.entries(groups).map(([k, v]) => {
        const groupsByFecha = _.groupBy(v, 'cedula');
        const subRows = Object.entries(groupsByFecha).map(([k2, v2]) => {
          return {
            cedula: k2,
            subRows: v2.map((v3) => ({
              documento: v3.documento,
              id: v3.id,
              producto: v3.producto,
              cantidad: v3.cantidad,
              precio: v3.precio + '$',
              total: v3.total + '$',
            }))
          };
        });
        return {
          fecha: v[0].fecha,
          subRows: subRows
        };
      });
  
      // Solo actualizar el estado si los datos han cambiado
      if (!_.isEqual(processedGroups, groupsPrecessed)) {
        setGroupsPrecessed(processedGroups);
        setDataDetalleDeVentaJson(processedGroups);
      }
    }, [dataDetalleDeVentaAtom, groupsPrecessed, setDataDetalleDeVentaJson]);

  return (
    <Box flexGrow={1} sx={{ height: '500px', minWidth: '50vw', maxWidth: '90vw'}}>
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