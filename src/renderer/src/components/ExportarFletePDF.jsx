import { Button } from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ExportarFletePDF({data}) {

    const generatePDF = () => {
        const doc = new jsPDF('landscape');

        doc.text('Reporte Flete', 130, 20);

        const colums = ['Fecha', 'Fletero', 'Chofer', 'Placa', 'Documento', 'Ruta', 'Cantidad Viajes', 'Precio', 'Total Operacion']

        let tabla = []
        data.map((data) => {
            tabla.push(
                [data.fecha, '','','','','','','','']
            )
            data.subRows.map((subRowFecha) => {
                tabla.push([
                    '',
                    subRowFecha.fletero,
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                ])
                subRowFecha.subRows.map((subRowFletero) => {
                    tabla.push([
                        '',
                        '',
                        subRowFletero.chofer,
                        subRowFletero.placa,
                        subRowFletero.documento,
                        subRowFletero.ruta,
                        subRowFletero.cantidadViajes,
                        subRowFletero.precio,
                        subRowFletero.totalOperacion,
                    ])
                })
                tabla.push([
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    'TOTAL',
                    subRowFecha.subRows.reduce(function(pre, curr){
                        return parseFloat(pre)+parseFloat(curr.totalOperacion);
                      },0) + '$',
                ])
                tabla.push([
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                ])
            })
        })
        let totalOperacion = 0
        data.forEach(element => {
            element.subRows.forEach(subRowFecha => {
                totalOperacion = parseFloat(totalOperacion) + parseFloat(subRowFecha.totalOperacion)
            });
        });
        tabla.push([
            '',
            'TOTAL DEL DOCUMENTO',
            '',
            '',
            '',
            '',
            '',
            '',
            totalOperacion + '$',
        ])

        doc.autoTable({
            startY: 30,
            head: [colums],
            body: tabla,
            theme: 'grid',
            styles: {
                lineWidth: 0.2, // Ancho del borde
                lineColor: [0, 0, 0], // Color del borde (negro)
                textColor: [0, 0, 0],
            },
            headStyles: {
                fillColor: [40, 127, 186], // Color azul para el encabezado
                textColor: [254, 254, 250],
            },
            didParseCell: function (data) {
                if (data.cell.raw === 'TOTAL') { 
                  data.cell.styles.fontStyle = 'bold'; // Cambia el estilo de la fuente
                  data.cell.styles.textColor = [254, 254, 250]; // Cambia el color del texto a rojo
                  data.cell.styles.fillColor = [40, 127, 186]; // Cambia el color de fondo
                }
                if (data.row.index === data.table.body.length - 1) {
                    data.cell.styles.fillColor = [19, 208, 10];
                    data.cell.styles.textColor = [0, 0, 0]; // Cambia el color del texto
                }
              }
        })

        doc.save(`ReporteFlete.pdf`);
    }

    return(
        <>
            <Button
            sx={{height: 40}}
            variant="contained"
            onClick={() => {
                generatePDF();
            }}
            >PDF</Button>
        </>
    )
    
}