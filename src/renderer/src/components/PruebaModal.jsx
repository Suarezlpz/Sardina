import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useAtomValue, useAtom } from 'jotai';
import { Container, List, ListItem, ListItemText, ListItemButton, Stack} from '@mui/material';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';


const style = {
  position: 'absolute',
  top: '50%',
  left: '55%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  width: '90%',
  boxShadow: 24,
  maxHeight: '80%',
  p: 4,
};

const boxStyle =
{
    maxHeight: '80%',
    overflowY: 'scroll',
    p: 4,
}

export default function PruebaModal({ abrir = false, setOpen}) {

  const handleClose = () => setOpen(false);

  const [selectTrabajador, setSelectTrabajador] = React.useState(0);
  const [searchTrabajador, setSearchTrabajador] = React.useState('');
  const [selected, setSelected] = React.useState(false);



    const filteredTrabajador = trabajadores.filter((item) =>
        item.cedula.toString().includes(searchTrabajador.toLowerCase())
    
    );

    let trabajador = filteredTrabajador[selectTrabajador] ?? null
    let rows = [trabajador];

  return (
    <div>
      <Modal
        sx={{width: '90%'}}
        open={abrir}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Container sx={style}>
            <Box sx={{display: 'flex'}}>
                {trabajador != null?
                    <Box sx={[boxStyle, {width: '70%'}]}>
                        Nombre: {trabajador.nombre} <br/>
                        Cedula: {trabajador.cedula}
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 50 }} aria-label="simple table">
                                <TableHead>
                                <TableRow>
                                    <TableCell>Fecha</TableCell>
                                    <TableCell align="right">Horas Trabajadas</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows[0].dates.map((item, index) => (
                                        <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {item.date}
                                            </TableCell>
                                            <TableCell align="right">
                                                {item.hours}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>: <Box sx={[boxStyle, {width: '70%'}]}></Box>
                }

                <Box sx={[boxStyle, {width: '30%'}]}>
                    <form>
                        <TextField
                            id="search-bar"
                            label="Buscar"
                            variant="outlined"
                            size="small"
                            onChange={(e) => {
                                setSearchTrabajador(e.target.value)
                            }}
                        />
                    </form>
                    <List>
                    { 
                        filteredTrabajador.map((item, index) => (
                            <ListItem key={item.cedula}>
                                <ListItemButton
                                sx={{
                                    minWidth: '120px',
                                    backgroundColor: index == selectTrabajador ? '#1287fd' : '',
                                    color: index == selectTrabajador ? '#fff' : ''
                                    }}
                                onClick={()=> {
                                    setSelected((prev) => !prev)
                                    setSelectTrabajador(index);
                                }}>
                                    <ListItemText  >
                                        {item.cedula}
                                    </ListItemText> 
                                </ListItemButton>
                            </ListItem> 
                        ))
                    }
                    </List>
                </Box>
            </Box>
            <Stack direction={'row'} spacing={1.5}>
                <Button
                variant="contained"
                disabled = {selectTrabajador == 0}
                onClick={()=> {
                    setSelectTrabajador(selectTrabajador - 1)
                }}
                >Anterior</Button>
                <Button
                variant="contained"
                >Grabar</Button>
                <Button
                variant="contained"
                disabled = {selectTrabajador == filteredTrabajador.length-1}
                onClick={()=> {
                    setSelectTrabajador(selectTrabajador + 1)
                }}
                >Siguiente</Button>
            </Stack>
        </Container>
      </Modal>
    </div>
  );
}

const trabajadores = [
    {
        'cedula': 23592814,
        'nombre': "Enmanuel Marval",
        'dates':
        [
            {
            'date': "14-03-2024",
            'hours': 1
            },
            {
            'date': "15-03-2024",
            'hours': 2
            },
            {
            'date': "16-03-2024",
            'hours': 3
            }
        ]
    },
    {
        'cedula': 2222214,
        'nombre': "Enmanueasdl Marval",
        'dates':
        [
            {
            'date': "14-03-2024",
            'hours': 45
            },
            {
            'date': "15-03-2024",
            'hours': 452
            },
            {
            'date': "16-03-2024",
            'hours': 3232
            }
        ]
    },
    {
        'cedula': 24123456,
        'nombre': "Mex",
        'dates': 
        [
            {
            'date': "17-03-2024",
            'hours': 4
            },
            {
            'date': "18-03-2024",
            'hours': 5
            },
            {
            'date': "19-03-2024",
            'hours': 6
            }
        ]
    },
]