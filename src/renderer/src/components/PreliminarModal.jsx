import { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { useAtomValue, useAtom } from 'jotai'
import { DatosProcesadosAtom, DatosProcesadosJsonAtom} from '../atoms/DatosProcesadosAtom';
import "./PreliminarModel.css"
import { MaterialReactTable } from 'material-react-table';
import _ from 'lodash';
const columns = ([
  {
    accessorKey: 'zona',
    header: 'ZONA',
  },
  {
    accessorKey: 'fecha',
    header: 'FECHA',
    grow: false, //don't allow this column to grow to fill in remaining space - new in v2.8
    size: 50, //small column
  },
  {
    accessorKey: 'proveedor',
    header: 'PROVEEDOR',
  },
  {
    accessorKey: 'id',
    header: 'DOCUMENTO',
    grow: false,
    size: 50,
  },
  {
    accessorKey: 'total',
    header: 'TOTAL',
    grow: false,
    size: 100,
  },
  {
    accessorKey: 'producto',
    header: 'PRODUCTO',
    size: 100,
  },
  {
    accessorKey: 'cantidad',
    header: 'CANTIDAD',
    grow: false,
    size: 50,
  },
  {
    accessorKey: 'precio',
    header: 'PRECIO',
    grow: false,
    size: 100,
  },
  {
    accessorKey: 'totalOperacion',
    header: 'TOTAL OPERACION',
    grow: false,
    size: 100,
  },

]);

export default function PreliminarModal() {
  const datosProcesadosAtom = useAtomValue(DatosProcesadosAtom);
  const [datosProcesados, setDatosProcesados] = useAtom(DatosProcesadosJsonAtom)
  const [groupsPrecessed, setGroupsPrecessed] = useState([]);

  useEffect(() => {
    const rows = datosProcesadosAtom;
    const groups = _.groupBy(rows, 'zona');
    const processedGroups = Object.entries(groups).map(([k, v]) => {
      const groupsByFecha = _.groupBy(v, 'fecha');
      const subRows = Object.entries(groupsByFecha).map(([k2, v2]) => {
        const groupsByProveedor = _.groupBy(v2, 'proveedor');
        const subRows2 = Object.entries(groupsByProveedor).map(([k3, v3]) => {
    
          return ({
            proveedor: v3[0].proveedor,
            total: v3.reduce((acc, x) => acc + Number(x.total), 0) + '$',
            cantidad: v3.reduce((acc, x) => acc + Number(x.cantidad), 0),
            totalOperacion: v3.reduce((acc, x) => acc + Number(x.totalOperacion), 0) + '$',
            subRows: v3.map((v4) => ({
                id: v4.id,
                producto: v4.producto,
                total: v4.total + '$',
                cantidad: v4.cantidad,
                totalOperacion: v4.totalOperacion + '$',
                precio: v4.precio + '$'
            }))
          })
        })
        return ({
          fecha: v2[0].fecha,
          total: v2.reduce((acc, x) => acc + Number(x.total), 0) + '$',
          cantidad: v2.reduce((acc, x) => acc + Number(x.cantidad), 0),
          totalOperacion: v2.reduce((acc, x) => acc + Number(x.totalOperacion), 0) + '$',
          subRows: subRows2
        })
      })
      return ({
        zona: v[0].zona,
        subRows: subRows
      })
    })
    if (!_.isEqual(processedGroups, groupsPrecessed)) {
      setGroupsPrecessed(processedGroups);
      setDatosProcesados(processedGroups);
    }

  }, [datosProcesadosAtom, groupsPrecessed, setDatosProcesados]);
    
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
