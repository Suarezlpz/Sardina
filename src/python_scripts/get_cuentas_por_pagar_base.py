import pyodbc
import json
import sys

#Se obtiene el nombre del dns del primer argumento enviado al script. Por ejemplo $ py test.py DATASOURCE
dsn = sys.argv[1]
# Establece la conexión utilizando el DSN
conn = pyodbc.connect('DSN=' + dsn)
# Crea un cursor para ejecutar consultas SQL
cursor = conn.cursor()
# Ejecuta consultas SQL
sqlQuery = """
    SELECT
        SCUENTASXPAGAR.FCP_FECHAEMISION,
        SCUENTASXPAGAR.FCP_CODIGO,
        SPROVEEDOR.FP_DESCRIPCION AS PROVEEDOR,
        SCUENTASXPAGAR.FCP_NUMERO,
        SCUENTASXPAGAR.FCP_MONTOORIGINALEXT,
        SCUENTASXPAGAR.FCP_SALDOMONEDAEXT
    FROM
        SCUENTASXPAGAR,SOPERACIONINV,SPROVEEDOR
        WHERE
        SCUENTASXPAGAR.FCP_CODIGO = SPROVEEDOR.FP_CODIGO AND
        SCUENTASXPAGAR.FCP_CODIGO = 'V18213223' AND
        SCUENTASXPAGAR.FCP_NUMERO = SOPERACIONINV.FTI_DOCUMENTO AND
        SOPERACIONINV.FTI_FECHAEMISION BETWEEN '2024-03-20' AND '2024-03-20' AND
        SCUENTASXPAGAR.FCP_FECHAEMISION BETWEEN '2024-03-20' AND '2024-03-20' AND SOPERACIONINV.FTI_NITCLIENTE= 'MORRO' AND
        SOPERACIONINV.FTI_TIPO= 6 AND
        SOPERACIONINV.FTI_STATUS= 1 AND
        SPROVEEDOR.FP_STATUS =1 AND
        SCUENTASXPAGAR.FCP_TIPOTRANSACCION = 1 AND
        SCUENTASXPAGAR.FCP_SALDOMONEDAEXT <> 0 GROUP BY
        SCUENTASXPAGAR.FCP_NUMERO,SCUENTASXPAGAR.FCP_CODIGO
"""

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