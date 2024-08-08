import { useEffect, useState } from 'react';
import * as React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import { DrawerTitleAtom } from '../atoms/DrawerTitle';
import { useAtomValue, useAtom } from 'jotai';
import { ZonasSeleccionadasAtom } from '../atoms/ZonasSeleccionadasAtom';
import { ProveedoresAtom } from '../atoms/ProveedoresAtom';
import RangoFecha from './RangoFecha';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';

export default function FiltroPorPagar() {

  const [zonas, setZonas] = React.useState([]);
  const [nombreZona, setNombreZona] = useAtom(ZonasSeleccionadasAtom);

  const [proveedores, setProveedores] = React.useState([]);
  const [proveedorCedula, setProveedorCedula] = useAtom(ProveedoresAtom);

  useEffect(() => {

    let tempProveedores = []
    let tempZonas = []

    window.api.getProveedor().then((result) => {
      result.forEach((proveedor) => {
        tempProveedores.push(createDataProveedor(...proveedor))
      })
      setProveedores(tempProveedores)
      setProveedorCedula([])
    })

    window.api.getZona().then((result) => {
      result.forEach((zona) => {
        tempZonas.push(createDataZona(...zona))
      })
      setZonas(tempZonas)
      setNombreZona([])
    })


  }, [])
  return (
      <Box flexDirection={'row'} display={'flex'} flexGrow={1}>
        <FormControl sx={{ m: 1, width: '12vw'}} >
          <Autocomplete
            multiple
            limitTags={1}
            id="checkboxes-tags-demo"
            options={zonas}
            disableCloseOnSelect
            getOptionLabel={(option) => option.name}
            onChange={(event, newValue) => {
              setNombreZona([ ...newValue ].map(x => x.name));
            }}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Chip
                    variant="outlined"
                    key={key}
                    label={option.name}
                    {...tagProps}
                  />
                );
              })
            }
            renderInput={(params) => (
              <TextField {...params} label="Zonas" />
            )}
          />
        </FormControl>

        <FormControl sx={{ m: 1, width: '12vw'}}>
          <Autocomplete
            multiple
            limitTags={1}
            id="checkboxes-tags-demo"
            options={proveedores}
            disableCloseOnSelect
            getOptionLabel={(option) => option.ci + ' - ' + option.name}
            onChange={(event, newValue) => {
              setProveedorCedula([ ...newValue ].map(x => x.ci));
            }}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Chip
                    variant="outlined"
                    key={key}
                    label={option.ci + ' - ' + option.name}
                    {...tagProps}
                  />
                );
              })
            }
            renderInput={(params) => (
              <TextField {...params} label="Proveedores" />
            )}
          />
        </FormControl>
        <RangoFecha/>
      </Box>
  );
}

function createDataProveedor(ci, name) {
  return { ci, name }
}
function createDataZona(name) {
  return { name }
}
