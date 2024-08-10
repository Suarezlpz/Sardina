import { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { useAtomValue, useAtom } from 'jotai'
import "./PreliminarModel.css"
import { MaterialReactTable } from 'material-react-table';
import { PorPagarAtom, PorPagarJsonAtom} from '../atoms/PorPagarAtom';
import _ from 'lodash';


const columns = ([
  {
    accessorKey: 'zona',
    header: 'ZONA',
    grow: false, //don't allow this column to grow to fill in remaining space - new in v2.8
    size: 50, //small column
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
    grow: false,
    size: 50,
  },
  {
    accessorKey: 'id',
    header: 'DOCUMENTO',
    grow: false,
    size: 50,
  },
  {
    accessorKey: 'montoOriginal',
    header: 'SALDO',
    grow: false,
    size: 50,
  },
  {
    accessorKey: 'abono',
    header: 'ABONO',
    grow: false,
    size: 50,
  },
  {
    accessorKey: 'fechaProx',
    header: 'FECHA A.',
    grow: false, //don't allow this column to grow to fill in remaining space - new in v2.8
    size: 50, //small column
  }
]);


export default function TablaPorPagar() {

  const porPagar = useAtomValue(PorPagarAtom);
  const [porPagarJson, setPorPagarJson] = useAtom(PorPagarJsonAtom)
  const [groupsPrecessed, setGroupsPrecessed] = useState([]);

  let proveedorFormateado = []
  if(porPagar != ''){
    proveedorFormateado = porPagar.map(item => {
        item.proveedor = item.proveedor.replace(/\[MP\-\SE\]|\(MP\s*SE\)|\[SE\]|\[MP\]|\(SE\s*MP\)|\(MP\-\SE\)|\(SE\)|\(MP\)|\[SE\-\MP\]/g, '').trim();
        return item;
    });
  }
/*
  const rows = porPagar;
  var groups = Object.groupBy(rows, ({ fecha }) => fecha);

  var groupsPrecessed = Object.entries(groups).map(([k, v]) => {

    var groupsByProveedor = Object.groupBy(v, ({ proveedor }) => proveedor);

    let subRows = Object.entries(groupsByProveedor).map(([k2, v2]) => {

      return ({
        proveedor: k2,
        subRows: v2.map((v3) => ({
            id: v3.id,
            montoOriginal: v3.montoOriginal+ '$',
            abono: v3.abono+ '$',
            fechaProx: v3.fechaProx,
            zona: v3.zona
        }))
      })
    })

    return ({
      fecha: v[0].fecha,
      subRows: subRows
    })
  })*/


    useEffect(() => {
      const rows = porPagar;
      const groups = _.groupBy(rows, 'zona');
      const processedGroups = Object.entries(groups).map(([k, v]) => {
        const groupsByFecha = _.groupBy(v, 'fecha');
        const subRows = Object.entries(groupsByFecha).map(([k2, v2]) => {
          const groupsByProveedor = _.groupBy(v2, 'proveedor');
          const subRows2 = Object.entries(groupsByProveedor).map(([k3, v3]) => {
            return {
              proveedor: k3,
              montoOriginal: v3.reduce((acc, x) => acc + Number(x.montoOriginal), 0).toFixed(2) + '$',
              subRows: v3.map((v4) => ({
                id: v4.id,
                montoOriginal: v4.montoOriginal + '$',
                abono: v4.abono + '$',
                fechaProx: v4.fechaProx
              }))
            };
          });
          return {
            fecha: v2[0].fecha,
            montoOriginal: v2.reduce((acc, x) => acc + Number(x.montoOriginal), 0).toFixed(2) + '$',
            subRows: subRows2
          };
        });
        return {
          zona: v[0].zona,
          subRows: subRows
        };
      });
  
      // Solo actualizar el estado si los datos han cambiado
      if (!_.isEqual(processedGroups, groupsPrecessed)) {
        setGroupsPrecessed(processedGroups);
        setPorPagarJson(processedGroups);
      }
    }, [porPagar, groupsPrecessed, setPorPagarJson]);

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

