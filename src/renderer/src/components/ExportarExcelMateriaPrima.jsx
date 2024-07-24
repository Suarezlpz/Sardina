import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import * as XLSX from 'xlsx'

export default function ExportarExcelMP({data}) {

    const [loading, setLoading] = useState(false)
    const titulo = [{A: 'Reporte Materia Prima'},{}]


    const longitudes = [15, 35, 15, 15, 20, 15, 15, 15, 15]

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
            H: 'Total Operacion'
        }]

        data.forEach((data) => {
            tabla.push({
                A: data.fecha,
                B: '',
                C: '',
                D: data.total,
                E: '',
                F: data.cantidad,
                G: '',
                H: data.totalOperacion,
            })
            data.subRows.map((subRowFecha) => {
                tabla.push({
                    A: '',
                    B: subRowFecha.proveedor,
                    C: '',
                    D: subRowFecha.total,
                    E: '',
                    F: subRowFecha.cantidad,
                    G: '',
                    H: subRowFecha.totalOperacion,
                })
                subRowFecha.subRows.map((subRowProveedor) => {
                    tabla.push({
                        A: '',
                        B: '',
                        C: subRowProveedor.id,
                        D: subRowProveedor.total,
                        E: subRowProveedor.producto,
                        F: subRowProveedor.cantidad,
                        G: subRowProveedor.precio,
                        H: subRowProveedor.totalOperacion,
                    })
                });
            });
        });      
        
        const dataFinal = [...titulo, ...tabla]
        console.log('datwa', tabla)
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