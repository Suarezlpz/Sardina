import { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useAtomValue, useAtom } from 'jotai'
import { productSumModalAtom } from '../atoms/ProductSumModal'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { IconButton } from '@mui/material';

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

export default function ProductSumList({abrir = false, setOpen}) {
  
  const productSumModal = useAtomValue(productSumModalAtom)
  const [resto, setResto] = useState([]);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={abrir}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <List
            display="flex"
            justifyContent="space-between"
            sx={{
              width: '100%',
              bgcolor: 'background.paper'
            }}>
            {
              productSumModal.map((value) => (
                <ListItem
                  key={value}
                  secondaryAction={
                      <ListItemText
                        primary = {parseInt(value[2] / 24)}
                        secondary = {parseInt(value[2]) % 24}
                      />
                  }
                >
                  <ListItemText primary={`${value[0]} ${value[1]}`} />
                </ListItem>
              ))
            }
            <Divider />
            <ListItem
              key={'Suma'}
              secondaryAction={
              productSumModal.reduce((partialSum, value) => {return (partialSum + parseInt(value[2])) }, 0)
              }

            >
              <ListItemText primary={'Total:'} />
            </ListItem>
          </List>
          <Button variant="text"
            onClick={() => handleClose()}
          >Cerrar</Button>
        </Box>
      </Modal>
    </div>
  );
}