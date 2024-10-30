import pyodbc
import json
import sys

#Se obtiene el nombre del dns del primer argumento enviado al script. Por ejemplo $ py test.py DATASOURCE
dsn = sys.argv[1]
start_date = sys.argv[2]
end_date = sys.argv[3]

# Establece la conexión utilizando el DSN
conn = pyodbc.connect('DSN=' + dsn)
# Crea un cursor para ejecutar consultas SQL
cursor = conn.cursor()
# Ejecuta consultas SQL
sqlQuery = """
    SELECT FDI_FECHAOPERACION AS FECHA_OPERACION,  FDI_CLIENTEPROVEEDOR AS CLIENTE, FDI_CODIGO AS CODIGO_PRODUCTO,FDI_DOCUMENTO AS DOCUMENTO, FDI_CANTIDAD AS CANTIDAD, FDI_PRECIODEVENTA AS PRECIO_UNITARIO,(FDI_CANTIDAD*FDI_PRECIODEVENTA)AS TOTAL,FDI_VENDEDORASIGNADO FROM SDETALLEVENTA WHERE FDI_TIPOOPERACION = 11 AND FDI_FECHAOPERACION BETWEEN '{start_date}' AND '{end_date}'
""".format(start_date=start_date, end_date=end_date)

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