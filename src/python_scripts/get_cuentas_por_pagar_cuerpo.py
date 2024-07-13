import pyodbc
import json
import sys

#Se obtiene el nombre del dns del primer argumento enviado al script. Por ejemplo $ py test.py DATASOURCE
dsn = sys.argv[1]
start_date = sys.argv[2]
end_date = sys.argv[3]
zona_query = sys.argv[4]
proveedor_query = sys.argv[5]
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
        SCUENTASXPAGAR.FCP_SALDOMONEDAEXT,
        SOPERACIONINV.FTI_NITCLIENTE,
        SOPERACIONINV.FTI_TIPO,
        SOPERACIONINV.FTI_STATUS,
        SCUENTASXPAGAR.FCP_TIPOTRANSACCION,
        SCUENTASXPAGAR.FCP_FECHAPROXIMA
    FROM
        SCUENTASXPAGAR
    INNER JOIN
        SOPERACIONINV ON SCUENTASXPAGAR.FCP_NUMERO = SOPERACIONINV.FTI_DOCUMENTO
    INNER JOIN
        SPROVEEDOR ON SCUENTASXPAGAR.FCP_CODIGO = SPROVEEDOR.FP_CODIGO
    WHERE
        SCUENTASXPAGAR.FCP_FECHAEMISION BETWEEN  '{start_date}' AND '{end_date}' AND
        {zona_query}
        {proveedor_query}
        SPROVEEDOR.FP_STATUS = 1 AND
        SCUENTASXPAGAR.FCP_MONEDA = 2 AND
        (SCUENTASXPAGAR.FCP_TIPOTRANSACCION = 1 OR SCUENTASXPAGAR.FCP_TIPOTRANSACCION = 54)
""".format(start_date=start_date, end_date=end_date, zona_query=zona_query, proveedor_query=proveedor_query)

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