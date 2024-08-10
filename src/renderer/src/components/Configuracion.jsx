import {React, useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import StorageIcon from '@mui/icons-material/Storage';
import TextField from '@mui/material/TextField';
import Stack from "@mui/material/Stack";
import { Button } from '@mui/material';
import Fab from '@mui/material/Fab';
import SaveIcon from '@mui/icons-material/Save';
import Snackbar from '@mui/material/Snackbar';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { SnackbarProvider, useSnackbar } from 'notistack';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Configuracion() {

  const { enqueueSnackbar } = useSnackbar();
  const [config, setConfig] = useState(null)
  const [snackbar, setSnackbar] = useState(false)

  const fabStyle = {
    position: 'absolute',
    bottom: 16,
    right: 16,
  };

  useEffect(() => {
      window.api.getConfiguration().then((result) => {
        setConfig(result);
      })
  }, []);

  if (config === null) {
    return <></>
  }

    return(
        <Box flexGrow={1}>
          <Box width={'100%'}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 5 }}>
              <StorageIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
              <TextField id="bd-name" label="Nombre Base de Datos" variant="standard" value={config.db_name}
                 onChange={(e) => {
                   setConfig(prev => ({...prev, db_name: e.target.value}))
                 }} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 5 }}>
              <StorageIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
              <TextField id="bd-name-aux" label="Nombre Base de Datos aux" variant="standard" value={config.db_name2}
                 onChange={(e) => {
                   setConfig(prev => ({...prev, db_name2: e.target.value}))
                 }} />
            </Box>

            <Box width={'65vw'}>
              {config.materias_primas.map((materia_prima, index) => {
                return <>
                  <Box>
                    <Stack direction={'row'} spacing={10}>
                      <TextField id={index + 'name'} fullWidth label="Nombre" variant="standard" value={materia_prima.materia_prima}
                        onChange={(e) => {

                          setConfig(prev => {

                             let conf = { ...prev }

                              conf.materias_primas[index].materia_prima = e.target.value

                              return conf
                          })
                        }}
                      />
                      <TextField id={index + 'code'} label="Codigo" variant="standard" value={materia_prima.codigo}
                        onChange={(e) => {

                          setConfig(prev => {

                            let conf = { ...prev }

                              conf.materias_primas[index].codigo = e.target.value

                              return conf
                          })
                        }}
                      />
                      <IconButton   
                      onClick={() => {
                        setConfig(prev => {
                          let conf = { ...prev }
                          conf.materias_primas.splice(index, 1);

                          return conf
                        })
                      }}                    
                      >
                        <DeleteIcon/>
                      </IconButton>
                    </Stack>
                  </Box>
                </>
              })}
            </Box>

          </Box>

          <Snackbar
            sx={{ml: 35}}
            open={snackbar}
            message="Configuracion guardada"
            autoHideDuration={1500}
          />
          <Fab color="primary" sx={fabStyle} aria-label="add" onClick={() =>{
                window.api.setConfiguration(config).then(() => {
                  window.api.getConfiguration().then((result) => {
                    setConfig(result);
                    enqueueSnackbar('Configuracio guardada', {variant : 'success'});
                  })
                })
            }}>
            <SaveIcon />
          </Fab>
          <Fab color="success" sx={{position: 'absolute', bottom: 16, right: 80,}} 
              aria-label="add" onClick={() =>{
                setConfig(prev => {

                  let conf = { ...prev }

                   conf.materias_primas.push({codigo:'' , materia_prima:''})

                   return conf
                })
            }}>
            <AddBoxIcon />
          </Fab>
        </Box>
    );
}
