import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
//import * as XLSX from 'xlsx';
import * as XLSX from 'xlsx-js-style';

export default function ExportarExcel({data}) {

    const [loading, setLoading] = useState(false)
    const titulo = [{A: {v: 'Reporte Cuentas Por Pagar', s: {font: { name: "Arial", sz: 30, bold: true, }, fill: { fgColor: { rgb: "FF0000" } },alignment: { horizontal: "center", vertical: "center" }}}},{}]

    const longitudes = [17,17,40,17,17,17,17,17,17,17]

    const handleDownload = () =>{
        setLoading(true);

        let tabla = [{
            A: {v: 'Zona', s: {font: { name: "Arial", sz: 12, bold: true}, fill: { fgColor: { rgb: "4FA4F9" }}}}, 
            B: {v: 'Fecha', s: {font: { name: "Arial", sz: 12, bold: true}, fill: { fgColor: { rgb: "4FA4F9" } }}},
            C: {v: 'Proveedor', s: {font: { name: "Arial", sz: 12, bold: true}, fill: { fgColor: { rgb: "4FA4F9" } }}},
            D: {v: 'Documento', s: {font: { name: "Arial", sz: 12, bold: true}, fill: { fgColor: { rgb: "4FA4F9" } }}},
            E: {v: 'Monto Original', s: {font: { name: "Arial", sz: 12, bold: true}, fill: { fgColor: { rgb: "4FA4F9" } }}},
            F: {v: 'Monto Abono', s: {font: { name: "Arial", sz: 12, bold: true}, fill: { fgColor: { rgb: "4FA4F9" } }}},
            G: {v: 'Proxima Fecha', s: {font: { name: "Arial", sz: 12, bold: true}, fill: { fgColor: { rgb: "4FA4F9" } }}},
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
                        D: {v: 'TOTAL', s: {font: { name: "Arial", sz: 10, bold: true}, fill: { fgColor: { rgb: "13D00A" } }}},
                        E: {v: subRowProveedor.subRows.reduce(function(pre, curr){
                            return parseFloat(pre)+parseFloat(curr.montoOriginal);
                          },0) + '$',  s: {font: { name: "Arial", sz: 10, bold: true}, fill: { fgColor: { rgb: "13D00A" } }}},
                        F: '',
                        G: '',
                    })
                    tabla.push({
                        A: '',
                        B: '',
                        C: '',
                        D: '',
                        E: '',
                        F: '',
                        G: '',
                    })
                })
            })
        });
        let montoOriginal = 0
        data.forEach(element => {
            element.subRows.forEach(subRowFecha => {
                montoOriginal = parseFloat(montoOriginal) + parseFloat(subRowFecha.montoOriginal)
            });
        });
        tabla.push({
            A: {v: '', s: {font: { name: "Arial", sz: 10, bold: true}, fill: { fgColor: { rgb: "13D00A" } }}},
            B: {v: '', s: {font: { name: "Arial", sz: 10, bold: true}, fill: { fgColor: { rgb: "13D00A" } }}},
            C: {v: 'TOTAL DEL DOCUMENTO', s: {font: { name: "Arial", sz: 10, bold: true}, fill: { fgColor: { rgb: "13D00A" } }}},
            D: {v: '', s: {font: { name: "Arial", sz: 10, bold: true}, fill: { fgColor: { rgb: "13D00A" } }}},
            E: {v: montoOriginal + '$', s: {font: { name: "Arial", sz: 10, bold: true}, fill: { fgColor: { rgb: "13D00A" } }}},
            F: {v: '', s: {font: { name: "Arial", sz: 10, bold: true}, fill: { fgColor: { rgb: "13D00A" } }}},
            G: {v: '', s: {font: { name: "Arial", sz: 10, bold: true}, fill: { fgColor: { rgb: "13D00A" } }}},
        })  
        
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
        XLSX.writeFile(libro, 'ReportePorPagar.xlsx')
    }

    return (
        <>    
            <Button
                sx={{height: 40}}
                variant="contained"
                onClick={()=>{
                    handleDownload()
                }}
            >Excel</Button>
        </>
    );
}

