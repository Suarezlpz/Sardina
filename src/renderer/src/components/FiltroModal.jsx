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



export default function FiltroModal() {

  const [zonas, setZonas] = React.useState([]);
  const [nombreZona, setNombreZona] = useAtom(ZonasSeleccionadasAtom);
  const [materiaPrima, setMateriaPrima] = useAtom(MateriaPrimaAtom);
  const [chofer, setChofer] = React.useState('');

  const [proveedores, setProveedores] = React.useState([]);
  const [proveedorCedula, setProveedorCedula] = useAtom(ProveedoresAtom);

  const theme = useTheme();
  const handleChangeProveedor = (event) => {
    const {
      target: { value },
    } = event;
    setProveedorCedula(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleChangeZona = (event) => {
    const {
      target: { value },
    } = event;
    setNombreZona(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleChangeMateriaPrima = (event) => {
    const {
      target: { value },
    } = event;
    setMateriaPrima(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const DrawerTitle = useAtomValue(DrawerTitleAtom)

  const handleChangeChofer = (event) => {
    setChofer(event.target.value);
  };


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

  }, [])
  return (
      <Box flexDirection={'row'} display={'flex'} minWidth={'70vw'} maxWidth={'90vw'}>
        <FormControl sx={{ m: 1, width: 300}} >
          <InputLabel id="demo-multiple-chip-label">Zona</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={nombreZona}
            onChange={handleChangeZona}
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}
          >
            {zonas.map((zona) => (
              <MenuItem
              key={zona.name}
              value={zona.name}
              >
                <Checkbox checked={nombreZona.indexOf(zona.name) > -1} />
                <ListItemText primary={zona.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ m: 1, width: 300}}>
          <InputLabel id="demo-multiple-chip-label">Proveedor</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={proveedorCedula}
            onChange={handleChangeProveedor}
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}
          >
            {proveedores.map((proveedor) => (
              <MenuItem
              key={proveedor.ci}
              value={proveedor.ci}
              >
                <Checkbox checked={proveedorCedula.indexOf(proveedor.ci) > -1} />
                <ListItemText primary={proveedor.ci + '- ' + proveedor.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, width: 300}}>
          <InputLabel id="demo-multiple-chip-label">Materia Prima</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={materiaPrima}
            onChange={handleChangeMateriaPrima}
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}
          >
            {materiasPrima.map((item) => (
              <MenuItem
              key={item.codigo}
              value={item.codigo}
              >
                <Checkbox checked={materiaPrima.indexOf(item.codigo) > -1} />
                <ListItemText primary={item.codigo + '- ' + item.materia_prima} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {DrawerTitle == 1?
          <FormControl sx={{ m: 1, width: 300}}>
            <InputLabel id="demo-simple-select-label">Chofer</InputLabel>
            <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={chofer}
            label="Age"
            onChange={handleChangeChofer}
            >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>: ''
        }
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

var materiasPrima = [
  {
    "materia_prima": "SARDINA FRESCAR CORTADA",
    "codigo": "MP000001"
  },
  {
    "materia_prima": "SARDINA ENTERA",
    "codigo": "MP000003"
  },
  {
    "materia_prima": "PEPITONA",
    "codigo": "MP000004"
  },
  {
    "materia_prima": "SUBPRODUCTO DE SARDINA",
    "codigo": "SP000001"
  },
  {
    "materia_prima": "SUBPRODUCTO DE SARDINA ENTERA",
    "codigo": "SP000002"
  },
  {
    "materia_prima": "SUBPRODUCTO DE SARDINA PICADA",
    "codigo": "SP000003"
  },
  {
    "materia_prima": "MACHUELO",
    "codigo": "SP000005"
  },
]
