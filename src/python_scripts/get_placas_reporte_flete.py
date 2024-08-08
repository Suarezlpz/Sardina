import pyodbc
import json
import sys

#Se obtiene el nombre del dns del primer argumento enviado al script. Por ejemplo $ py test.py DATASOURCE
dsn = sys.argv[1]
placaQuery = sys.argv[2]
# Establece la conexión utilizando el DSN
conn = pyodbc.connect('DSN=' + dsn)
# Crea un cursor para ejecutar consultas SQL
cursor = conn.cursor()
# Ejecuta consultas SQL
sqlQuery = """
    SELECT CODIGO,DESCRIPCION FROM a2CCostos WHERE {placaQuery} AND MOVIMIENTO = TRUE AND STATUS= TRUE
""".format(placaQuery=placaQuery)

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