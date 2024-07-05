import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { DataGrid } from '@mui/x-data-grid';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { DataProcesadaAtom } from '../atoms/DataProcesada';
import { useAtomValue } from 'jotai';
import { List, ListItem, ListItemText} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '55%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  width: '80%',
  boxShadow: 24,
  maxHeight: '80%',
  overflowY: 'scroll',
  p: 4,
};

export default function DataProcesadaModal({ abrir = false, setOpen}) {

  const dataProcesada = useAtomValue(DataProcesadaAtom)
  const handleClose = () => setOpen(false);

    const rows = [];
    for (const fecha in dataProcesada) {    
        let detalles = [];

        for(const cedula in dataProcesada[fecha]){
          detalles.push(

            <ListItem>
              <ListItemText
              primary={`Nombre: ${dataProcesada[fecha][cedula].nombre}`}
              secondary={
                <ListItemText
                primary = {`Cedula: ${dataProcesada[fecha][cedula].cedula}`}
                secondary = {
                  <ListItemText>{`Departamento: ${dataProcesada[fecha][cedula].departamento} / Horas: ${dataProcesada[fecha][cedula].horas}`}
                  </ListItemText>
                }
                />
              }
              />
            </ListItem>
          )
        }           
        rows.push(
        <Accordion>
          <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
          >
            <Typography>{fecha}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {detalles}
            </List>
              
          </AccordionDetails>
        </Accordion>)
    }

  return (
    <div>
      <Modal
        sx={{width: '90%'}}
        open={abrir}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >

        <Box sx={style}>
          {rows}
        </Box>
      </Modal>
    </div>
  );
}
