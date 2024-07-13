import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import * as XLSX from 'xlsx'

export default function ExportarExcel({data}) {

    const [loading, setLoading] = useState(false)
    const titulo = [{A: 'Reporte Cuentas Por Pagar'},{}]


    const longitudes = [15, 15, 35, 15, 15, 15,15,15,15,15,15]

    const handleDownload = () =>{
        setLoading(true);

        let tabla = [{
            A: 'Fecha',
            B: 'Cedula',
            C: 'Proveedor',
            D: 'Documento',
            E: 'Monto Original',
            F: 'Abono',
            G: 'Zona',
            H: 'Tipo de Transaccion',
            I: 'Status',
            J: 'Status Cliente',
            K: 'Proxima Fecha',
        }]

        data.forEach((data) => {
            tabla.push({
                A: data.fecha,
                B: data.ci,
                C: data.proveedor,
                D: data.id,
                E: data.montoOriginal,
                F: data.abono,
                G: data.zona,
                H: data.tipoTransaccion,
                I: data.ftiStatus,
                J: data.statusCliente,
                K: data.fechaProx,
            })
        });      
        
        const dataFinal = [...titulo, ...tabla]

        setTimeout(() => {
            creandoArchivo(dataFinal)
            setLoading(false);
        }, 1000);
    }

    const creandoArchivo = (dataFinal) => {
        const libro = XLSX.utils.book_new();
        const hoja = XLSX.utils.json_to_sheet(dataFinal, {skipHeader: true});

        hoja['!merges'] = [
            XLSX.utils.decode_range('A1:K1'),
            XLSX.utils.decode_range('A2:K2'),
        ];

        let propiedades = [];
 
        longitudes.forEach((col) => {
            propiedades.push({
                width: col,
            })
        });

        hoja['!cols'] = propiedades;

        XLSX.utils.book_append_sheet(libro, hoja, 'data');
        XLSX.writeFile(libro, 'dataDesdeElBoton.xlsx')
    }

    return (
        <>    
            <Button
                sx={{height: 40}}
                variant="contained"
                onClick={()=>{
                    handleDownload()
                }}
            >Exportar</Button>
        </>
    );
}

