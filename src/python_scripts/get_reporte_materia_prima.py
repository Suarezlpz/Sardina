import pyodbc
import json
import sys

#Se obtiene el nombre del dns del primer argumento enviado al script. Por ejemplo $ py test.py DATASOURCE
dsn = sys.argv[1]
start_date = sys.argv[2]
end_date = sys.argv[3]
zona_query = sys.argv[4]
proveedor_status_query = sys.argv[5]
proveedor_query = sys.argv[6]
materia_prima_query = sys.argv[7]
# Establece la conexión utilizando el DSN
conn = pyodbc.connect('DSN=' + dsn)
# Crea un cursor para ejecutar consultas SQL
cursor = conn.cursor()
# Ejecuta consultas SQL
sqlQuery = """
    SELECT
        SOPERACIONINV.FTI_FECHAEMISION,
        SPROVEEDOR.FP_DESCRIPCION AS PROVEEDOR,
        SOPERACIONINV.FTI_DOCUMENTO,
        SOPERACIONINV.FTI_TOTALNETO AS TOTAL,
        SDETALLECOMPRA.FDI_CODIGO AS PRODUCTO,
        SDETALLECOMPRA.FDI_CANTIDAD,
        (SDETALLECOMPRA.FDI_COSTOOPERACION * 10) AS PRECIO,
        (SDETALLECOMPRA.FDI_COSTOOPERACION * SDETALLECOMPRA.FDI_CANTIDAD) AS TOTAL_OPERACION,
        SOPERACIONINV.FTI_NITCLIENTE AS ZONA FROM SPROVEEDOR,
        SOPERACIONINV,
        SDETALLECOMPRA 
    WHERE 
        SOPERACIONINV.FTI_TIPO = 6 AND 
        SOPERACIONINV.FTI_STATUS = 1 AND 
        SOPERACIONINV.FTI_RESPONSABLE = SPROVEEDOR.FP_CODIGO AND 
        SOPERACIONINV.FTI_DOCUMENTO = SDETALLECOMPRA.FDI_DOCUMENTO AND 
        SOPERACIONINV.FTI_FECHAEMISION BETWEEN '{start_date}' AND '{end_date}' AND 
        {zona_query}
        {proveedor_status_query}
        {proveedor_query}
        {materia_prima_query}
        SOPERACIONINV.FTI_TOTALNETO <> 0 
    GROUP BY SOPERACIONINV.FTI_DOCUMENTO, SDETALLECOMPRA.FDI_CODIGO;
""".format(start_date=start_date, end_date=end_date, zona_query=zona_query, proveedor_status_query=proveedor_status_query, proveedor_query=proveedor_query,materia_prima_query=materia_prima_query)

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
