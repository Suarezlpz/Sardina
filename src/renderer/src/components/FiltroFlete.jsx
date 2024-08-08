import { useEffect, useState } from 'react';
import * as React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import { useAtomValue, useAtom } from 'jotai';
import { useTheme } from '@mui/material/styles';
import { ZonasSeleccionadasAtom } from '../atoms/ZonasSeleccionadasAtom';
import RangoFecha from './RangoFecha';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import { ProveedoresFleteCedulaAtom } from '../atoms/ProveedorFleteCedula';

export default function FiltroFlete() {

  const [proveedorFleteCedula, setProveedorFleteCedula] = useAtom(ProveedoresFleteCedulaAtom);
  const [proveedores, setProveedores] = React.useState([]);

  const theme = useTheme();

  useEffect(() => {

    let tempProveedores = []
    window.api.getProveedorFlete().then((result) => {

      result.forEach((proveedor) => {
        tempProveedores.push(createDataProveedor(...proveedor))
      })
      setProveedores(tempProveedores);
    })

  }, [])

  return (
      <Box flexDirection={'row'} display={'flex'} flexGrow={1}>
       {/* <FormControl sx={{ m: 1, width: '12vw'}}>
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
              <TextField {...params} label="Chofer" />
            )}
          />
        </FormControl> */}

        <FormControl sx={{ m: 1, width: '12vw'}}>
          <Autocomplete
            multiple
            limitTags={1}
            id="checkboxes-tags-demo"
            options={proveedores}
            disableCloseOnSelect
            getOptionLabel={(option) => option.ci + ' - ' + option.name}
            onChange={(event, newValue) => {
              setProveedorFleteCedula([ ...newValue ].map(x => x.ci));
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
       {/* <FormControl sx={{ m: 1, width: '12vw'}}>
          <Autocomplete
              multiple
              limitTags={1}
              id="checkboxes-tags-demo"
              options={materiaPrimaSelect}
              disableCloseOnSelect
              getOptionLabel={(option) => option.materia_prima}
              onChange={(event, newValue) => {
                setMateriaPrima([ ...newValue ].map(x => x.codigo));
              }}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return (
                    <Chip
                      variant="outlined"
                      key={key}
                      label={option.materia_prima}
                      {...tagProps}
                    />
                  );
                })
              }
              renderInput={(params) => (
                <TextField {...params} label="Materia Prima" />
              )}
            />
        </FormControl>*/}
        <RangoFecha/>
      </Box>
  );
}

function createDataProveedor(ci, name) {
  return { ci, name }
}

