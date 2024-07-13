import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import * as XLSX from 'xlsx'

export default function ExportarExcelMP({data}) {

    const [loading, setLoading] = useState(false)
    const titulo = [{A: 'Reporte Materia Prima'},{}]


    const longitudes = [15, 35, 15, 15, 15, 15, 15, 15, 15]

    const handleDownload = () =>{
        setLoading(true);

        let tabla = [{
            A: 'Fecha',
            B: 'Proveedor',
            C: 'Documento',
            D: 'Total',
            E: 'Producto',
            F: 'Cantidad',
            G: 'Precio',
            H: 'Total Operacion',
            I: 'Zona',
        }]

        data.forEach((data) => {
            tabla.push({
                A: data.fecha,
                B: data.proveedor,
                C: data.id,
                D: data.total,
                E: data.producto,
                F: data.cantidad,
                G: data.precio,
                H: data.totalOperacion,
                I: data.zona
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