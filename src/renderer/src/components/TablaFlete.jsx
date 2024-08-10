import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useAtomValue, useAtom } from 'jotai';
import { MaterialReactTable } from 'material-react-table';
import { DataFleteAtom, DataFleteJsonAtom } from '../atoms/DataFleteAtom';
import _ from 'lodash';


const columns = ([
  {
    accessorKey: 'fecha',
    header: 'FECHA',
    grow: false, //don't allow this column to grow to fill in remaining space - new in v2.8
    size: 50, //small column
  },
  {
    accessorKey: 'fletero',
    header: 'FLETERO',
    grow: false,
    size: 50,
  },
  {
    accessorKey: 'chofer',
    header: 'CHOFER',
    grow: false,
    size: 50,
  },
  {
    accessorKey: 'placa',
    header: 'PLACA',
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
    accessorKey: 'ruta',
    header: 'PRODUCTO',
    grow: false,
    size: 50,
  },
  {
    accessorKey: 'cantidadViajes',
    header: 'CANTIDAD VIAJES',
    grow: false, //don't allow this column to grow to fill in remaining space - new in v2.8
    size: 50, //small column
  },
  {
    accessorKey: 'precio',
    header: 'PRECIO',
    grow: false, //don't allow this column to grow to fill in remaining space - new in v2.8
    size: 50, //small column
  },
  {
    accessorKey: 'totalOperacion',
    header: 'TOTAL OPERACION',
    grow: false, //don't allow this column to grow to fill in remaining space - new in v2.8
    size: 50, //small column
  }
]);


export default function TablaFlete() {

  const dataFlete = useAtomValue(DataFleteAtom);
  const [dataFleteJson, setDataFleteJson] = useAtom(DataFleteJsonAtom)
  const [groupsPrecessed, setGroupsPrecessed] = useState([]);

  let fleteroFormateado = []
  if(dataFlete != ''){
    fleteroFormateado = dataFlete.map(item => {
        item.fletero = item.fletero.replace(/\[MP\-\SE\]|\(MP\s*SE\)|\[SE\]|\[MP\]|\(SE\s*MP\)|\(MP\-\SE\)|\(SE\)|\(MP\)|\[SE\-\MP\]|\[MP\s*SE\]/g, '').trim();
        return item;
    });
  }

    useEffect(() => {
      const rows = dataFlete;
      const groups = _.groupBy(rows, 'fecha');
      const processedGroups = Object.entries(groups).map(([k, v]) => {
        const groupsByFecha = _.groupBy(v, 'fletero');
        const subRows = Object.entries(groupsByFecha).map(([k2, v2]) => {
          return {
            fletero: v2[0].fletero,
            totalOperacion: v2.reduce((acc, x) => acc + Number(x.totalOperacion), 0).toFixed(2) + '$',
            subRows: v2.map((v3) => ({
              placa: v3.placa,
              chofer: v3.chofer,
              documento: v3.documento,
              ruta: v3.ruta,
              cantidadViajes: v3.cantidadViajes,
              precio: v3.precio + '$',
              totalOperacion: v3.totalOperacion + '$',
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
        setDataFleteJson(processedGroups);
      }
    }, [dataFlete, groupsPrecessed, setDataFleteJson]);

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