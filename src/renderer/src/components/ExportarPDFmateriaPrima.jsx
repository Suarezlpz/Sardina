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
                        'TOTAL',
                        subRowFecha.total,
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