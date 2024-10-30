import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
//import * as XLSX from 'xlsx';
import * as XLSX from 'xlsx-js-style';
import { convertFieldResponseIntoMuiTextFieldProps } from '@mui/x-date-pickers/internals';

export default function ExportarExcelDetalleDeVenta({data}) {

    const [loading, setLoading] = useState(false)
    const titulo = [{A: {v: 'Detalles De Venta', s: {font: { name: "Arial", sz: 30, bold: true, }, fill: { fgColor: { rgb: "FF0000" } },alignment: { horizontal: "center", vertical: "center" }}}},{}]

    const longitudes = [17,17,40,17,17,17,17,17,17,17]

    const handleDownload = () =>{
        setLoading(true);

        let tabla = [{
            A: {v: 'Fecha', s: {font: { name: "Arial", sz: 12, bold: true}, fill: { fgColor: { rgb: "4FA4F9" }}}}, 
            B: {v: 'Cedula', s: {font: { name: "Arial", sz: 12, bold: true}, fill: { fgColor: { rgb: "4FA4F9" } }}},
            C: {v: 'Documento', s: {font: { name: "Arial", sz: 12, bold: true}, fill: { fgColor: { rgb: "4FA4F9" } }}},
            D: {v: 'ID', s: {font: { name: "Arial", sz: 12, bold: true}, fill: { fgColor: { rgb: "4FA4F9" } }}},
            E: {v: 'Cantidad', s: {font: { name: "Arial", sz: 12, bold: true}, fill: { fgColor: { rgb: "4FA4F9" } }}},
            F: {v: 'Precio', s: {font: { name: "Arial", sz: 12, bold: true}, fill: { fgColor: { rgb: "4FA4F9" } }}},
            G: {v: 'Total', s: {font: { name: "Arial", sz: 12, bold: true}, fill: { fgColor: { rgb: "4FA4F9" } }}},
        }]

        data.map((data) => {
            tabla.push({
                A: data.fecha,
                B: '',
                C: '',
                D: '',
                E: '',
                F: '',
                G: '',
            })
            data.subRows.map((subRowFecha) => {
                tabla.push({
                    A: '',
                    B: subRowFecha.cedula,
                    C: '',
                    D: '',
                    E: '',
                    F: '',
                    G: '',
                })
                subRowFecha.subRows.map((subRowCedula) => {
                    tabla.push({
                        A: '',
                        B: '',
                        C: subRowCedula.documento,
                        D: subRowCedula.id,
                        E: subRowCedula.cantidad,
                        F: subRowCedula.precio,
                        G: subRowCedula.total,
                    })
                })
                tabla.push({
                    A: '',
                    B: '',
                    C: '',
                    D: '',
                    E: '',
                    F: {v: 'TOTAL', s: {font: { name: "Arial", sz: 10, bold: true}, fill: { fgColor: { rgb: "13D00A" } }}},
                    G: {v: subRowFecha.subRows.reduce(function(pre, curr){
                        return parseFloat(pre)+parseFloat(curr.total);
                        },0).toFixed(2) + '$',  s: {font: { name: "Arial", sz: 10, bold: true}, fill: { fgColor: { rgb: "13D00A" } }}},
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
        XLSX.writeFile(libro, 'ReporteDetallesDeVenta.xlsx')
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

