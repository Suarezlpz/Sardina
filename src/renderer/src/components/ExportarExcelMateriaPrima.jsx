import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
//import * as XLSX from 'xlsx';
import * as XLSX from 'xlsx-js-style';

export default function ExportarExcelMP({data}) {

    const [loading, setLoading] = useState(false)
    const titulo = [{A: {v: 'Reporte Materia Prima' , s: {font: { name: "Arial", sz: 30, bold: true, }, fill: { fgColor: { rgb: "FF0000" } },alignment: { horizontal: "center", vertical: "center" }}}},{}]


    const longitudes = [15, 15, 35, 20, 20, 20, 15, 15, 25]

    const handleDownload = () =>{
        setLoading(true);

        let tabla = [{
            A: {v: 'ZONA', s: {font: { name: "Arial", sz: 12, bold: true}, fill: { fgColor: { rgb: "4FA4F9" }}}}, 
            B: {v: 'FECHA', s: {font: { name: "Arial", sz: 12, bold: true}, fill: { fgColor: { rgb: "4FA4F9" }}}}, 
            C: {v: 'PROVEEDOR', s: {font: { name: "Arial", sz: 12, bold: true}, fill: { fgColor: { rgb: "4FA4F9" }}}}, 
            D: {v: 'DOCUMENTO', s: {font: { name: "Arial", sz: 12, bold: true}, fill: { fgColor: { rgb: "4FA4F9" }}}}, 
            E: {v: 'TOTAL', s: {font: { name: "Arial", sz: 12, bold: true}, fill: { fgColor: { rgb: "4FA4F9" }}}}, 
            F: {v: 'PRODUCTO', s: {font: { name: "Arial", sz: 12, bold: true}, fill: { fgColor: { rgb: "4FA4F9" }}}}, 
            G: {v: 'CANTIDAD', s: {font: { name: "Arial", sz: 12, bold: true}, fill: { fgColor: { rgb: "4FA4F9" }}}}, 
            H: {v: 'PRECIO', s: {font: { name: "Arial", sz: 12, bold: true}, fill: { fgColor: { rgb: "4FA4F9" }}}}, 
            I: {v: 'TOTAL OPERACION',  s: {font: { name: "Arial", sz: 12, bold: true}, fill: { fgColor: { rgb: "4FA4F9" }}}}
        }]

        data.forEach((data) => {
            tabla.push({
                A: data.zona,
                B: '',
                C: '',
                D: '',
                E: '',
                F: '',
                G: '',
                H: '',
                I: '',
            })
            data.subRows.map((subRowZona) => {
                tabla.push({
                    A: '',
                    B: subRowZona.fecha,
                    C: '',
                    D: '',
                    E: subRowZona.total,
                    F: '',
                    G: subRowZona.cantidad,
                    H: '',
                    I: subRowZona.totalOperacion,
                })
                tabla.push({
                    A: '',
                    B: '',
                    C: '',
                    D: '',
                    E: '',
                    F: '',
                    G: '',
                    H: '',
                    I: '',
                })
                subRowZona.subRows.map((subRowFecha) => {
                    tabla.push({
                        A: '',
                        B: '',
                        C: subRowFecha.proveedor,
                        D: {v: 'TOTAL', s: {font: { name: "Arial", sz: 10, bold: true}, fill: { fgColor: { rgb: "13D00A" } }}},
                        E: {v: subRowFecha.total, s: {font: { name: "Arial", sz: 10, bold: true}, fill: { fgColor: { rgb: "13D00A" } }}},
                        F: '',
                        G: subRowFecha.cantidad,
                        H: '',
                        I: subRowFecha.totalOperacion,
                    })
                    subRowFecha.subRows.map((subRowProveedor) => {
                        tabla.push({
                            A: '',
                            B: '',
                            C: '',
                            D: subRowProveedor.id,
                            E: subRowProveedor.total,
                            F: subRowProveedor.producto,
                            G: subRowProveedor.cantidad,
                            H: subRowProveedor.precio,
                            I: subRowProveedor.totalOperacion,
                        })
                    });
                    tabla.push({
                        A: '',
                        B: '',
                        C: '',
                        D: '',
                        E: '',
                        F: '',
                        G: '',
                        I: '',
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