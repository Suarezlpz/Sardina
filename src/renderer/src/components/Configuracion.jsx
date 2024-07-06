import {React, useState} from 'react';
import Box from '@mui/material/Box';
import StorageIcon from '@mui/icons-material/Storage';
import TextField from '@mui/material/TextField';
import Stack from "@mui/material/Stack";
export default function Configuracion() {

  const [config, setConfig] = useState(null)

  window.api.getConfiguration().then((result) => {
    setConfig(result);
  })

  if (config === null) {
    return <></>
  }
    return(
      <>
        <Box width={'100%'}>
          <Box maxHeight={'100px'}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 5 }}>
              <StorageIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
              <TextField id="bd-name" label="Nombre Base de Datos" variant="standard" value={config.db_name} />
            </Box>

            <Box>
              {config.materias_primas.map((materia_prima, index) => {
                return <>
                  <Box>
                    <Stack direction={'row'} spacing={10}>
                      <TextField id={index + 'name'} fullWidth label="Nombre" variant="standard" value={materia_prima.materia_prima}/>
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
