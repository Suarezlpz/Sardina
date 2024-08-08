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

        console.log(tabla, 'tabla')
        doc.autoTable({
            startY: 30,
            head: [colums],
            body: tabla,
            theme: 'grid',
            styles: {
                lineWidth: 0.2, // Ancho del borde
                lineColor: [0, 0, 0] // Color del borde (negro)
            },
            headStyles: {
                fillColor: [40, 127, 186] // Color azul para el encabezado
            },
            didParseCell: function (data) {
                if (data.cell.raw === 'TOTAL') { 
                  data.cell.styles.fontStyle = 'bold'; // Cambia el estilo de la fuente
                  data.cell.styles.textColor = [254, 254, 250]; // Cambia el color del texto a rojo
                  data.cell.styles.fillColor = [40, 127, 186]; // Cambia el color de fondo
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