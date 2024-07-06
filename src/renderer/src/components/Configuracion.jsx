import {React, useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import StorageIcon from '@mui/icons-material/Storage';
import TextField from '@mui/material/TextField';
import Stack from "@mui/material/Stack";
import { Button } from '@mui/material';
export default function Configuracion() {

  const [config, setConfig] = useState(null)

  useEffect(() => {
      window.api.getConfiguration().then((result) => {
        setConfig(result);
      })
  }, []);

  if (config === null) {
    return <></>
  }
    return(
      <>
        <Box width={'100%'}>
          <Button
            variant="contained"
            onClick={() =>{
                window.api.setConfiguration(config).then(() => {
                  window.api.getConfiguration().then((result) => {
                    setConfig(result);
                  })
                })
            }}
          >
            Guardar
          </Button>
          <Box maxHeight={'100px'}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 5 }}>
              <StorageIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
              <TextField id="bd-name" label="Nombre Base de Datos" variant="standard" value={config.db_name}
                 onChange={(e) => {
                   setConfig(prev => ({...prev, db_name: e.target.value}))
                 }} />
            </Box>

            <Box>
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
                      <TextField id={index + 'code'} label="Codigo" variant="standard" value={materia_prima.codigo}/>
                    </Stack>
                  </Box>
                </>
              })}
            </Box>

          </Box>
        </Box>
      </>
    );
}
