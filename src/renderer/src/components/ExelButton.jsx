import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import * as XLSX from 'xlsx/xlsx.mjs';
import UploadIcon from '@mui/icons-material/Upload';
import { styled } from '@mui/material/styles';
import { useAtomValue, useAtom } from 'jotai'
import { DatoBiometricoAtom } from '../atoms/DatoBiometrico';
import {satinezeJSON} from '../services/ManipulacionDeExcel'



const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

export default function ExcelButton() {
    const [datoBiometrico, setDatoBiometrico] = useAtom(DatoBiometricoAtom)


    function ProcesarArchivos( archivos ){
            var file = archivos[0];
            var reader = new FileReader();
    
            reader.onload = function (e) {
                var data = new Uint8Array(e.target.result);
                var workbook = XLSX.read(data, { type: "array" });
                var sheetName = workbook.SheetNames[0];
                var sheet = workbook.Sheets[sheetName];
                var jsonData = XLSX.utils.sheet_to_json(sheet, { header: 0 });
                //console.log(jsonData)
                var ArrayObjectGenerate = satinezeJSON(jsonData);
                setDatoBiometrico(ArrayObjectGenerate);
                
            };
            reader.readAsArrayBuffer(file);
    }


    return (
        <Box component="section" sx={{ marginBottom: '15px', marginTop: '15px'}}>
            <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<UploadIcon/>}
                
                >
                Agregar Archivo
                <VisuallyHiddenInput
                    type="file"
                    onChange={(event) => ProcesarArchivos(event.target.files)}
                    multiple
                />
            </Button>
        </Box>
    );

}
