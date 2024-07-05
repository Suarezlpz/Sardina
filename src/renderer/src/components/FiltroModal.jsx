import { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
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
import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import { ZonasSeleccionadasAtom } from '../atoms/ZonasSeleccionadasAtom';
import { ProveedoresAtom } from '../atoms/ProveedoresAtom';
import { MateriaPrimaAtom } from '../atoms/MateriaPrimaAtom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,

};


export default function FiltroModal({abrir = false, setOpen}) {

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
    
  const handleClose = () => setOpen(false);

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
    <div>
      <Modal
        open={abrir}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <Box>
              <FormControl sx={{ m: 1}} fullWidth>
                <InputLabel id="demo-multiple-chip-label">Zona</InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={nombreZona}
                  onChange={handleChangeZona}
                  input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
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

              <FormControl sx={{ m: 1}} fullWidth>
                <InputLabel id="demo-multiple-chip-label">Proveedor</InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={proveedorCedula}
                  onChange={handleChangeProveedor}
                  input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
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
              <FormControl sx={{ m: 1}} fullWidth>
                <InputLabel id="demo-multiple-chip-label">Materia Prima</InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={materiaPrima}
                  onChange={handleChangeMateriaPrima}
                  input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
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

              
              {DrawerTitle == 'Reporte Flete'?
                <FormControl fullWidth sx={{margin:'5px'}}>
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
                </FormControl>: ''}
            </Box>
            <Box>
              <Button
              onClick={() => {
                handleClose()
              }}>Aceptar</Button>
            </Box>
        </Box>
      </Modal>
    </div>
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

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
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