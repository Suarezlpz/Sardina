import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
//import * as XLSX from 'xlsx';
import * as XLSX from 'xlsx-js-style';
import _ from 'lodash';

export default function ExportarExcel({data}) {

    const [loading, setLoading] = useState(false)
    const titulo = [{A: 'Reporte Cuentas Por Pagar'},{}]

    const longitudes = [17,17,40,17,17,17,17,17,17,17]

    const handleDownload = () =>{
        setLoading(true);

        let tabla = [{
            A: 'Zona',
            B: 'Fecha',
            C: 'Proveedor',
            D: 'Documento',
            E: 'Monto Original',
            F: 'Monto Abono',
            G: 'Proxima Fecha',
        }]

        data.map((data) => {
            tabla.push({
                A: data.zona,
                B: '',
                C: '',
                D: '',
                E: '',
                F: '',
                G: '',
            })
            data.subRows.map((subRowZona) => {
                tabla.push({
                    A: '',
                    B: subRowZona.fecha,
                    C: '',
                    D: '',
                    E: '',
                    F: '',
                    G: '',
                })
                subRowZona.subRows.map((subRowProveedor) => {
                    tabla.push({
                        A: '',
                        B: '',
                        C: subRowProveedor.proveedor,
                        D: '',
                        E: '',
                        F: '',
                        G: '',
                    })
                    subRowProveedor.subRows.map((subRowResto) => {
                        tabla.push({
                            A: '',
                            B: '',
                            C: '',
                            D: subRowResto.id,
                            E: subRowResto.montoOriginal,
                            F: subRowResto.abono,
                            G: subRowResto.fechaProx,
                        })
                    })
                    tabla.push({
                        A: '',
                        B: '',
                        C: '',
                        D: 'TOTAL',
                        E: subRowProveedor.subRows.reduce(function(pre, curr){
                            return parseFloat(pre)+parseFloat(curr.montoOriginal);
                          },0) + '$',
                        F: '',
                        G: '',
                    })
                })
            })
        });      
        
        const dataFinal = [...titulo, ...tabla]

        console.log('data', tabla)

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

         // Obtener el rango de celdas
        const range = XLSX.utils.decode_range(hoja['!ref']);

        // Aplicar estilos a todas las celdas
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cell_address = { c: C, r: R };
                const cell_ref = XLSX.utils.encode_cell(cell_address);
                if (!hoja[cell_ref]) hoja[cell_ref] = {}; // Crear la celda si no existe
                hoja[cell_ref].s = {
                    font: {
                        name: 'Arial',
                        sz: 12,
                        color: { rgb: "000000" }
                    },
                };
            }
        }

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

