import { Button } from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ExportarPDFporPagar({data}) {

    const generatePDF = () => {
        const doc = new jsPDF();

        doc.text('Reporte Cuentas Por Pagar', 70, 20);

        const colums = ['Zona', 'Fecha', 'Proveedor', 'Documento', 'Monto Original', 'Monto Abono', 'Proxima Fecha']

        let tabla = []
        data.map((data) => {
            tabla.push(
                [data.zona, '','','','','','']
            )
            data.subRows.map((subRowZona) => {
                tabla.push([
                    '',
                    subRowZona.fecha,
                    '',
                    '',
                    '',
                    '',
                    '',
                ])
                subRowZona.subRows.map((subRowProveedor) => {
                    tabla.push([
                        '',
                        '',
                        subRowProveedor.proveedor,
                        '',
                        '',
                        '',
                        '',
                    ])
                    subRowProveedor.subRows.map((subRowResto) => {
                        tabla.push([
                            '',
                            '',
                            '',
                            subRowResto.id,
                            subRowResto.montoOriginal,
                            subRowResto.abono,
                            subRowResto.fechaProx,
                        ])
                    })
                    tabla.push([
                        '',
                        '',
                        '',
                        'TOTAL',
                        subRowProveedor.subRows.reduce(function(pre, curr){
                            return parseFloat(pre)+parseFloat(curr.montoOriginal);
                          },0) + '$',
                        '',
                        '',
                    ])
                    tabla.push([
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
        })
        let montoOriginal = 0
        data.forEach(element => {
            element.subRows.forEach(subRowFecha => {
                montoOriginal = parseFloat(montoOriginal) + parseFloat(subRowFecha.montoOriginal)
            });
        });
        tabla.push([
            '',
            '',
            'TOTAL DEL DOCUMENTO',
            '',
            montoOriginal + '$',
            '',
            '',
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
                  data.cell.styles.textColor = [254, 254, 250]; // Cambia el color del texto
                  data.cell.styles.fillColor = [40, 127, 186]; // Cambia el color de fondo
                }
                if (data.row.index === data.table.body.length - 1) {
                    data.cell.styles.fillColor = [19, 208, 10]; // Cambia el color de fondo
                    data.cell.styles.textColor = [0, 0, 0]; // Cambia el color del texto
                }
              }
        })

        doc.save(`ReporteCuentasPorPagar.pdf`);
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