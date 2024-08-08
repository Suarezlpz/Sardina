import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
//import * as XLSX from 'xlsx';
import * as XLSX from 'xlsx-js-style';

export default function ExportarExcelFlete({data}) {

    const [loading, setLoading] = useState(false)
    const titulo = [{A: {v: 'Reporte Flete', s: {font: { name: "Arial", sz: 30, bold: true, }, fill: { fgColor: { rgb: "FF0000" } },alignment: { horizontal: "center", vertical: "center" }}}},{}]

    const longitudes = [17,40,25,17,17,30,25,17,17]

    const handleDownload = () =>{
        setLoading(true);

        let tabla = [{
            A: {v: 'Fecha', s: {font: { name: "Arial", sz: 12, bold: true}, fill: { fgColor: { rgb: "4FA4F9" }}}}, 
            B: {v: 'Fletero', s: {font: { name: "Arial", sz: 12, bold: true}, fill: { fgColor: { rgb: "4FA4F9" } }}},
            C: {v: 'Chofer', s: {font: { name: "Arial", sz: 12, bold: true}, fill: { fgColor: { rgb: "4FA4F9" } }}},
            D: {v: 'Placa', s: {font: { name: "Arial", sz: 12, bold: true}, fill: { fgColor: { rgb: "4FA4F9" } }}},
            E: {v: 'Documento', s: {font: { name: "Arial", sz: 12, bold: true}, fill: { fgColor: { rgb: "4FA4F9" } }}},
            F: {v: 'Ruta', s: {font: { name: "Arial", sz: 12, bold: true}, fill: { fgColor: { rgb: "4FA4F9" } }}},
            G: {v: 'Cantidad Viajes', s: {font: { name: "Arial", sz: 12, bold: true}, fill: { fgColor: { rgb: "4FA4F9" } }}},
            H: {v: 'Precio', s: {font: { name: "Arial", sz: 12, bold: true}, fill: { fgColor: { rgb: "4FA4F9" } }}},
            I: {v: 'Total Operacion', s: {font: { name: "Arial", sz: 12, bold: true}, fill: { fgColor: { rgb: "4FA4F9" } }}},
        }]


        data.map((data) => {
            console.log(data)
            tabla.push({
                A: data.fecha,
                B: '',
                C: '',
                D: '',
                E: '',
                F: '',
                G: '',
                H: '',
                I: '',
            })
            data.subRows.map((subRowFecha) => {
                tabla.push({
                    A: '',
                    B: subRowFecha.fletero,
                    C: '',
                    D: '',
                    E: '',
                    F: '',
                    G: '',
                })
                subRowFecha.subRows.map((subRowFletero) => {
                    tabla.push({
                        A: '',
                        B: '',
                        C: subRowFletero.chofer,
                        D: subRowFletero.placa,
                        E: subRowFletero.documento,
                        F: subRowFletero.ruta,
                        G: subRowFletero.cantidadViajes,
                        H: subRowFletero.precio,
                        I: subRowFletero.totalOperacion,
                    })
                })
                /*tabla.push({
                    A: '',
                    B: '',
                    C: '',
                    D: {v: 'TOTAL', s: {font: { name: "Arial", sz: 10, bold: true}, fill: { fgColor: { rgb: "13D00A" } }}},
                    E: {v: subRowProveedor.subRows.reduce(function(pre, curr){
                        return parseFloat(pre)+parseFloat(curr.montoOriginal);
                        },0) + '$',  s: {font: { name: "Arial", sz: 10, bold: true}, fill: { fgColor: { rgb: "13D00A" } }}},
                    F: '',
                    G: '',
                    H: '',
                    I: '',
                })*/
                tabla.push({
                    A: '',
                    B: '',
                    C: '',
                    D: '',
                    E: '',
                    G: '',
                    H: '',
                    I: '',
                })
            })
        })     
        
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

        XLSX.utils.book_append_sheet(libro, hoja, 'data');
        XLSX.writeFile(libro, 'ReporteFlete.xlsx')
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

