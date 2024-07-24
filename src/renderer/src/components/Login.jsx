import * as React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useAtom } from 'jotai';
import { LoginAtom } from '../atoms/HotkeyActivoAtom';

export default function LoginPage() {

    const [showPassword, setShowPassword] = React.useState(false);
    const [contraseña, setContraseña] = React.useState('')
    const [login, setLogin] = useAtom(LoginAtom)

    
    return (
        <Box position={'absolute'} left={'45%'}>
            <Box>            
                <TextField
                sx={{ m: 1, width: '25ch' }}
                label="Clave"
                error= {login == false? true: false}
                variant="standard"
                type={showPassword ? 'text' : 'password'}
                value={contraseña}
                helperText={login == false? 'CONTRASEÑA INCORRECTA': false}
                onChange={(event) => {
                    setContraseña(event.target.value);
                    }}
                />
            </Box>
            <Box>
                <Button 
                sx={{ m: 1, width: '25ch' }}
                variant="contained"
                disabled = {contraseña === '' ? true: false}
                onClick={()=>{
                    contraseña == '1234567890'? setLogin(true): setLogin(false);
                }}
                >Entrar</Button>
            </Box>
        </Box>
    );
}