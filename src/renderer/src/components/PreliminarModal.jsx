import { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { useAtomValue, useAtom } from 'jotai'
import { DatosProcesadosAtom, DatosProcesadosJsonAtom} from '../atoms/DatosProcesadosAtom';
import "./PreliminarModel.css"
import { MaterialReactTable } from 'material-react-table';
import _ from 'lodash';
const columns = ([
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
    const groups = _.groupBy(rows, 'fecha');
    const processedGroups = Object.entries(groups).map(([k, v]) => {
      const groupsByProveedor = _.groupBy(v, 'proveedor');
      const subRows = Object.entries(groupsByProveedor).map(([k2, v2]) => {
  
        return ({
          proveedor: k2,
          total: v2.reduce((acc, x) => acc + Number(x.total), 0) + '$',
          cantidad: v2.reduce((acc, x) => acc + Number(x.cantidad), 0),
          totalOperacion: v2.reduce((acc, x) => acc + Number(x.totalOperacion), 0) + '$',
          subRows: v2.map((v3) => ({
              id: v3.id,
              producto: v3.producto,
              total: v3.total + '$',
              cantidad: v3.cantidad,
              totalOperacion: v3.totalOperacion + '$',
              precio: v3.precio + '$',
              zona: v3.zona
          }))
        })
      })
      return ({
        fecha: v[0].fecha,
        total: v.reduce((acc, x) => acc + Number(x.total), 0) + '$',
        cantidad: v.reduce((acc, x) => acc + Number(x.cantidad), 0),
        totalOperacion: v.reduce((acc, x) => acc + Number(x.totalOperacion), 0) + '$',
        subRows: subRows
      } )
    })
    if (!_.isEqual(processedGroups, groupsPrecessed)) {
      setGroupsPrecessed(processedGroups);
      setDatosProcesados(processedGroups);
      console.log('wqe', datosProcesados);
    }

  }, [datosProcesadosAtom, groupsPrecessed, setDatosProcesados]);
    
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
