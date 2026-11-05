# MongoDB: sharding y replicación

Proyecto 2da evaluacion
Bases de Datos Avanzadas

| Integrante | Matrícula |
|---|---|
| Kevin Andrés Rosales Rodríguez | 385814 |
| Edwin Noé Zaragoza Alvarado | 385609 |
| Manuel Ramírez Contreras | 385706 |

Repositorio: [Sharding-distribuido-en-MongoDB](https://github.com/Kevin67-67/Sharding-distribuido-en-MongoDB).
Referencia de arquitectura: [clúster anterior](https://github.com/Kevin67-67/MongoDB-Cluster).

## Contenido

- Base `sample_mflix`, colección `movies` y las **21 349 películas**
- Campo `id_movie` numérico (1–21349)
- Shard key **`{ id_movie: "hashed" }`**
- Tres shards; cada uno tiene tres miembros: un PRIMARY y dos SECONDARY cuando se sincronizan
- Un config server en su replica set `configRS` y un router `mongos`: **11 contenedores**
- CRUD desde mongos
- Demostración de desequilibrio controlado y posterior balanceo automatico
- Reporte del proyecto

## Relacion con la actividad anterior

**Este Compose administra el mismo clúster de `Actividad_1`.** Se conservan sus
cuatro volúmenes originales y su red, el nombre de proyecto sigue siendo
`actividad1-scott`.

Se conserva la arquitectura de config server, tres shards y mongos, y se añaden
dos secundarios por shard para mostrar replica real.

## Clonar y ejecutar

- Clúster anterior con sus volúmenes
- Git
- Docker con motor Linux
- Compose

```bash
git clone https://github.com/Kevin67-67/Sharding-distribuido-en-MongoDB.git
cd Sharding-distribuido-en-MongoDB
```

Seguir **[PASOS.md](PASOS.md)**. Ahi se encuentran los comandos completos para primera
configuración, importación, CRUD, balanceo y reanudación. Ejecutar una
etapa cada vez y detenerse ante un error, la importación solo se hace una vez.


## Monitoreo 

```bash
docker compose exec -T mongos mongosh --quiet --file /scripts/08-monitorear.js
```

## Archivos del proyecto

| Archivo | Función |
|---|---|
| `docker-compose.yml` | Clúster de películas con volúmenes persistentes, red y puerto local |
| `data/sample_mflix.movies.json.gz` | Dataset original comprimido |
| `data/manifest.json` | Origen, conteo, huellas y regla de id_movie |
| `scripts/lib/comun.js` | Consultas de distribución y almacenamiento de evidencia |
| `scripts/01-replica-config.js` | Consulta el configRS existente y guarda su estado |
| `scripts/02-replica-shard.js` | Añade dos secundarios al shard existente; ejecutar una sola vez por shard |
| `scripts/03-configurar-sharding.js` | Muestra los shards existentes y configura movies con la clave hashed |
| `scripts/04-importar-peliculas.js` | Importación BSON e incorporación de id_movie |
| `scripts/crud/01-insertar.js` | Inserta tres películas de ejemplo y registra el reparto |
| `scripts/crud/02-consultar.js` | Consulta y explain por identificador y género |
| `scripts/crud/03-actualizar.js` | Actualiza una película temporal y muestra el resultado |
| `scripts/crud/04-eliminar.js` | Elimina solo las tres películas temporales |
| `scripts/05-estado-replicas.js` | Registra PRIMARY/SECONDARY y muestras directas en los miembros |
| `scripts/06-preparar-balanceo.js` | Provoca desequilibrio mediante migraciones manuales de movies |
| `scripts/07-balanceo-automatico.js` | Activa y observa el balanceador, luego restaura parámetros |
| `scripts/08-monitorear.js` | Captura informativa adicional de la distribución |
| `docs/` | Carpeta para guardar las evidencias y redactar manualmente el reporte |
| `PASOS.md` | Procedimiento manual reproducible |

## Estructura

```text
Proyecto/
├── docker-compose.yml
├── README.md
├── PASOS.md
├── .gitignore
├── .gitattributes
├── data/
│   ├── manifest.json
│   └── sample_mflix.movies.json.gz
├── docs/
│   └── evidencias/
└── scripts/
    ├── lib/comun.js
    ├── crud/01-insertar.js
    ├── crud/02-consultar.js
    ├── crud/03-actualizar.js
    ├── crud/04-eliminar.js
    ├── 01-replica-config.js
    ├── 02-replica-shard.js
    ├── 03-configurar-sharding.js
    ├── 04-importar-peliculas.js
    ├── 05-estado-replicas.js
    ├── 06-preparar-balanceo.js
    ├── 07-balanceo-automatico.js
    └── 08-monitorear.js   
```


