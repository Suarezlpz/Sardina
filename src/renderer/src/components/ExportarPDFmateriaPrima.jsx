import { Button } from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ExportarPDFmateriaPrima({data}) {

    const generatePDF = () => {
        const doc = new jsPDF('landscape');

        doc.text('Reporte Materia Prima', 120, 20);

        const colums = ['Zona', 'Fecha', 'Proveedor', 'Documento', 'Total', 'Producto', 'Cantidad', 'Precio', 'Total Operacion']

        let tabla = []
        data.forEach((data) => {
            tabla.push([
                data.zona,
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
            ])
            data.subRows.map((subRowZona) => {
                tabla.push([
                    '',
                    subRowZona.fecha,
                    '',
                    '',
                    subRowZona.total,
                    '',
                    subRowZona.cantidad,
                    '',
                    subRowZona.totalOperacion,
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
                subRowZona.subRows.map((subRowFecha) => {
                    tabla.push([
                        '',
                        '',
                        subRowFecha.proveedor,
                        {content: 'TOTAL', styles:{fillColor: [19, 208, 10]}},
                        {content: subRowFecha.total,styles:{fillColor: [19, 208, 10]}},
                        '',
                        subRowFecha.cantidad,
                        '',
                        subRowFecha.totalOperacion,
                    ])
                    subRowFecha.subRows.map((subRowProveedor) => {
                        tabla.push([
                            '',
                            '',
                            '',
                            subRowProveedor.id,
                            subRowProveedor.total,
                            subRowProveedor.producto,
                            subRowProveedor.cantidad,
                            subRowProveedor.precio,
                            subRowProveedor.totalOperacion,
                        ])
                    });
                    tabla.push([
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                    ])
                });
            });
        });
        let totalOperacion = 0;
        let total = 0;
        data.forEach(element => {
            element.subRows.forEach(subRowFecha => {
                totalOperacion = parseFloat(totalOperacion) + parseFloat(subRowFecha.totalOperacion)
                total = parseFloat(total) + parseFloat(subRowFecha.total)
            });
        });
        tabla.push([
            '',
            'TOTAL DEL DOCUMENTO',
            '',
            '',
            total.toFixed(2) + '$',
            '',
            '',
            '',
            totalOperacion.toFixed(2)+ '$',
        ])

        doc.autoTable({
            startY: 30,
            head: [colums],
            body: tabla,
            theme: 'grid',
            styles: {
                lineWidth: 0.2, // Ancho del borde
                lineColor: [0, 0, 0], // Color del borde (negro)
                textColor: [0, 0, 0], // Cambia el color del texto
            },
            headStyles: {
                fillColor: [40, 127, 186], // Color azul para el encabezado
                textColor: [254, 254, 250], 
            },
            didParseCell: function (data) {
                if (data.row.index === data.table.body.length - 1) {
                    data.cell.styles.fillColor = [19, 208, 10];
                    data.cell.styles.textColor = [0, 0, 0]; 
                }
              }
        })

        doc.save(`ReporteMateriaPrima.pdf`);
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