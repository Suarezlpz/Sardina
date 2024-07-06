import { useEffect, useState, useMemo } from 'react'
import Box from '@mui/material/Box';
import { useAtomValue, useAtom } from 'jotai'
import { DatosProcesadosAtom } from '../atoms/DatosProcesadosAtom';
import { TableContainer, Table, TableHead, TableCell, TableBody, TableRow, TablePagination, Paper } from '@mui/material';

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  flexRender
} from '@tanstack/react-table'

const columns = [
  {
    accessorKey: 'fecha',
    header: 'Fecha',
    width: 90,
    cell: ({ row, getValue }) => (
      <div
        style={{
          paddingLeft: `${row.depth * 2}rem`,
        }}
      >
        <div>
          
          {row.getCanExpand() ? (
            <button
              {...{
                onClick: row.getToggleExpandedHandler(),
                style: { cursor: 'pointer' },
              }}
            >
              {row.getIsExpanded() ? '👇' : '👉'}
            </button>
          ) : (
            '🔵'
          )}{' '}
          {getValue()}
        </div>
      </div>
    ),
  },
  { 
    accessorKey: 'proveedor', 
      header: 'Proveedor', 
      width: 90 
  },
  { 
      accessorKey: 'id', 
      header: 'FTI_Documento', 
      width: 90 
  },
  { 
      accessorKey: 'total', 
      header: 'Total', 
      width: 90 
  },
  { 
      accessorKey: 'producto', 
      header: 'Producto', 
      width: 90 
  },
  {
    accessorKey: 'cantidad',
    header: 'FDI_Cantidad',
    width: 90
  },
  {
    accessorKey: 'precio',
    header: 'Precio',
    width: 90
  },
  {
    accessorKey: 'totalOperacion',
    header: 'Total_Operacion',
    width: 90
  },
  {
    accessorKey: 'zona',
    header: 'Zona',
    width: 90,
  },
]

function LocalTable({
  data,
  columns,
}) {

  const [expanded, setExpanded] = useState({})
  const [sorting, setSorting] = useState([])

  const table = useReactTable({
    data,
    columns,
    // Pipeline
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    //
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 5
      }
    },
    state: {
      expanded,
      sorting
    },
    onExpandedChange: setExpanded,
    getSubRows: row => row.subRows,
  })

  const { pageSize, pageIndex } = table.getState().pagination

  console.log(table.getState().sorting)
  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableCell key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : ''
                          }
                          onClick={header.column.getToggleSortingHandler()}
                          title={
                            header.column.getCanSort()
                              ? header.column.getNextSortingOrder() === 'asc'
                                ? 'Sort ascending'
                                : header.column.getNextSortingOrder() === 'desc'
                                  ? 'Sort descending'
                                  : 'Clear sort'
                              : undefined
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted()] ?? null}
                        </div>
                      )}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map(row => {
              return (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => {
                    return (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10]}
        component="div"
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={pageSize}
        page={pageIndex}
        slotProps={{
          select: {
            inputProps: { 'aria-label': 'rows per page' },
            native: true,
          },
        }}
        onPageChange={(_, page) => {
          table.setPageIndex(page)
        }}
        onRowsPerPageChange={e => {
          const size = e.target.value ? Number(e.target.value) : 5
          table.setPageSize(size)
        }}
        //ActionsComponent={TablePaginationActions}
      />
    </Box>
  )
}

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
        <LocalTable
          data={groupsPrecessed}
          columns={columns}
        />
    </Box>

  );
}