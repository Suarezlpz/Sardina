import { useEffect, useState } from 'react';
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DrawerTitleAtom } from '../atoms/DrawerTitle';
import { useAtomValue, useAtom } from 'jotai';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import { ZonasSeleccionadasAtom } from '../atoms/ZonasSeleccionadasAtom';
import { ProveedoresAtom } from '../atoms/ProveedoresAtom';
import { MateriaPrimaAtom } from '../atoms/MateriaPrimaAtom';
import RangoFecha from './RangoFecha';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';

export default function FiltroModal() {

  const [zonas, setZonas] = React.useState([]);
  const [nombreZona, setNombreZona] = useAtom(ZonasSeleccionadasAtom);


  const [materiaPrima, setMateriaPrima] = useAtom(MateriaPrimaAtom);
  const [materiaPrimaSelect, setMateriaPrimaSelect] = React.useState([]);
  const [chofer, setChofer] = React.useState('');

  const [proveedores, setProveedores] = React.useState([]);
  const [proveedorCedula, setProveedorCedula] = useAtom(ProveedoresAtom);

  const theme = useTheme();


  const DrawerTitle = useAtomValue(DrawerTitleAtom)

  useEffect(() => {

    let tempProveedores = []
    let tempZonas = []

    window.api.getProveedor().then((result) => {
      result.forEach((proveedor) => {
        tempProveedores.push(createDataProveedor(...proveedor))
      })
      setProveedores(tempProveedores)
    })

    window.api.getZona().then((result) => {
      result.forEach((zona) => {
        tempZonas.push(createDataZona(...zona))
      })
      setZonas(tempZonas)
    })

    window.api.getConfiguration().then((result) => {
      setMateriaPrimaSelect(result.materias_primas)
    })

  }, [])
  return (
      <Box flexDirection={'row'} display={'flex'}>
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

        <FormControl sx={{ m: 1, width: 300}}>
          <Autocomplete
            multiple
            limitTags={1}
            id="checkboxes-tags-demo"
            options={proveedores}
            disableCloseOnSelect
            getOptionLabel={(option) => option.ci}
            onChange={(event, newValue) => {
              setNombreZona([ ...newValue ].map(x => x.ci));
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
        <FormControl sx={{ m: 1, width: 300}}>
          <Autocomplete
              multiple
              limitTags={1}
              id="checkboxes-tags-demo"
              options={materiaPrimaSelect}
              disableCloseOnSelect
              getOptionLabel={(option) => `${option.codigo} - ${option.materia_prima}`}
              onChange={(event, newValue) => {
                setNombreZona([ ...newValue ].map(x => x.codigo));
              }}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return (
                    <Chip
                      variant="outlined"
                      key={key}
                      label={option.codigo}
                      {...tagProps}
                    />
                  );
                })
              }
              renderInput={(params) => (
                <TextField {...params} label="Materia Prima" />
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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
