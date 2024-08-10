import pyodbc
import json
import sys

#Se obtiene el nombre del dns del primer argumento enviado al script. Por ejemplo $ py test.py DATASOURCE
dsn = sys.argv[1]
start_date = sys.argv[2]
end_date = sys.argv[3]
proveedor_query = sys.argv[4]
proveedor_status_query = sys.argv[5]
materiaPrimaQuery = sys.argv[6]
# Establece la conexión utilizando el DSN
conn = pyodbc.connect('DSN=' + dsn)
# Crea un cursor para ejecutar consultas SQL
cursor = conn.cursor()
# Ejecuta consultas SQL
sqlQuery = """
    SELECT 
        SOPERACIONINV.FTI_FECHAEMISION, 
        SPROVEEDOR.FP_DESCRIPCION AS FLETERO,
        SOPERACIONINV.FTI_ORDENCOMPRA AS CHOFER,
        SDETALLECOMPRA.FDI_CTOCOSTOSTR AS PLACA,
        SOPERACIONINV.FTI_DOCUMENTO, 
        SINVENTARIO.FI_DESCRIPCION AS RUTA, 
        SDETALLECOMPRA.FDI_CANTIDAD AS CANTIDAD_VIAJES,
        (SDETALLECOMPRA.FDI_COSTOOPERACION * 10) AS PRECIO,
        (SDETALLECOMPRA.FDI_COSTOOPERACION * SDETALLECOMPRA.FDI_CANTIDAD) AS TOTAL_OPERACION 
    FROM
        SOPERACIONINV
    JOIN
        SPROVEEDOR ON SOPERACIONINV.FTI_RESPONSABLE = SPROVEEDOR.FP_CODIGO AND SPROVEEDOR.FP_DESCRIPCION LIKE '%MP-%'
    JOIN
        SDETALLECOMPRA ON SOPERACIONINV.FTI_DOCUMENTO = SDETALLECOMPRA.FDI_DOCUMENTO
    JOIN
        SINVENTARIO ON SDETALLECOMPRA.FDI_CODIGO = SINVENTARIO.FI_CODIGO
    WHERE
        (SOPERACIONINV.FTI_FECHAEMISION BETWEEN '{start_date}' AND '{end_date}') AND
        {proveedor_query}
        {proveedor_status_query}
        {materiaPrimaQuery}
        SOPERACIONINV.FTI_TIPO = 6
        AND SOPERACIONINV.FTI_STATUS = 1
    GROUP BY 
        SOPERACIONINV.FTI_FECHAEMISION, 
        SPROVEEDOR.FP_DESCRIPCION,
        SOPERACIONINV.FTI_ORDENCOMPRA,
        SDETALLECOMPRA.FDI_CTOCOSTOSTR, 
        SOPERACIONINV.FTI_DOCUMENTO, 
        SINVENTARIO.FI_DESCRIPCION,
        SDETALLECOMPRA.FDI_CANTIDAD;
""".format(start_date=start_date, end_date=end_date, proveedor_query=proveedor_query, proveedor_status_query=proveedor_status_query, materiaPrimaQuery=materiaPrimaQuery)

cursor.execute(sqlQuery)
# Recupera los resultados
rows = cursor.fetchall()

data = []

# Aqui estamos creando un arreglo y convirtiendo cada propiedad a string ya que campos como por
# ejemplo fechas, no se transforman a texto implicitamente.

for row in rows:
    data.append([str(x) for x in row])

# Creamos el json  y lo imprimimos, ya que el paquete de node lee la terminal interna
result = json.dumps(data)

print(result)
# Cierra la conexión
conn.close()