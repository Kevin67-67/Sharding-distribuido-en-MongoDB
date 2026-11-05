# Procedimiento

Abrir Docker Desktop y PowerShell en la carpeta que contiene `docker-compose.yml`.

## Reutilizar el clúster anterior

El nombre Compose es **actividad1-scott**, igual que en la actividad anterior, y
el puerto publicado es **27030**. 

Si ya se importo, ir al paso 10 para reanudar.

## 1. Iniciar los diez servidores

```bash
docker compose up -d configsvr shard1 shard1b shard1c shard2 shard2b shard2c shard3 shard3b shard3c
```

## 2. Consultar configRS y ampliar los replica sets de shards

```bash
docker compose exec -T configsvr mongosh --quiet --file /scripts/01-replica-config.js
docker compose exec -T shard1 mongosh --quiet --file /scripts/02-replica-shard.js
docker compose exec -T shard2 mongosh --quiet --file /scripts/02-replica-shard.js
docker compose exec -T shard3 mongosh --quiet --file /scripts/02-replica-shard.js
```

`01-replica-config.js` muestra el estado del configRS ya inicializado.
`02-replica-shard.js` añade los dos secundarios a cada shard existente; ejecutar
esa ampliación una sola vez por shard. Si ya se hizo, omitirla.


## 3. Iniciar mongos y configurar la colección vacía

```bash
docker compose up -d mongos
```

```bash
docker compose exec -T mongos mongosh --quiet --file /scripts/03-configurar-sharding.js
```

Los tres shards ya están registrados en la actividad anterior. El script los
muestra y configura la colección nueva con `{ id_movie: "hashed" }`. 

## 4. Importar las películas y asignar id_movie

**Carga inicial: una sola vez** 

```bash
docker compose exec -T mongos mongosh --quiet --file /scripts/04-importar-peliculas.js
```

El script descomprime el archivo proporcionado, restaura tipos BSON mediante EJSON,
añade id_movie del 1 al 21349 e inserta lotes de 500 con write concern majority

## 5. Consultar los estados de replicación y distribución

```bash
docker compose exec -T mongos mongosh --quiet --file /scripts/05-estado-replicas.js
docker compose exec -T mongos mongosh --quiet --file /scripts/08-monitorear.js
docker compose ps --all
```

## 6. CRUD y monitoreo después de cada operación

Ejecutar por separado, observando la salida de cada archivo:

```bash
docker compose exec -T mongos mongosh --quiet --file /scripts/crud/01-insertar.js
docker compose exec -T mongos mongosh --quiet --file /scripts/crud/02-consultar.js
docker compose exec -T mongos mongosh --quiet --file /scripts/crud/03-actualizar.js
docker compose exec -T mongos mongosh --quiet --file /scripts/crud/04-eliminar.js
```

Cada operación guarda su respuesta y un snapshot antes/despues

## 7. Preparar el desequilibrio para la demostración

```bash
docker compose exec -T mongos mongosh --quiet --file /scripts/06-preparar-balanceo.js
```

Este archivo pausa el balanceo solo de movies y mueve sus rangos a shard1RS con
moveChunk y límites hashed.

## 8. Observar el balanceador automático

```bash
docker compose exec -T mongos mongosh --quiet --file /scripts/07-balanceo-automatico.js
```

El script registra 12 muestras cada 10 segundos: tarda aproximadamente dos minutos,
mas el tiempo de las consultas. Dejarlo terminar para que restaure los parametros.
El tiempo de observacion no garantiza que el balanceo haya concluido.

## 9. Consultas

Desde la terminal del sistema:

```bash
docker compose exec mongos mongosh
```

Dentro de mongosh:

```javascript
use sample_mflix
db.movies.findOne({ id_movie: 1 })
db.movies.countDocuments({})
db.movies.getShardDistribution()
db.getSiblingDB("admin").aggregate([
  { $shardedDataDistribution: {} },
  { $match: { ns: "sample_mflix.movies" } }
]).toArray()
sh.status()
exit
```

Compass se conecta a `mongodb://localhost:27030`

## 10. Detener y reanudar sin repetir cargas

Terminal del sistema:

```bash
docker compose stop
```

Para reanudar:

```bash
docker compose up -d configsvr shard1 shard1b shard1c shard2 shard2b shard2c shard3 shard3b shard3c
docker compose up -d mongos
docker compose exec -T mongos mongosh --quiet --file /scripts/08-monitorear.js
```
