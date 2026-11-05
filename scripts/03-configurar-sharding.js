// Los tres shards ya están registrados en el clúster anterior
// Configuración inicial de sample_mflix.movies: ejecutar una sola vez

load('/scripts/lib/comun.js');
printjson(Mflix.admin.runCommand({ listShards: 1 }));
printjson(sh.enableSharding('sample_mflix'));
const base = db.getSiblingDB('sample_mflix');
printjson(base.createCollection('movies'));
print(Mflix.movies.createIndex({ id_movie: 'hashed' }));
printjson(sh.shardCollection(Mflix.namespace, { id_movie: 'hashed' }));

Mflix.guardar('sharding', {
  shards: Mflix.admin.runCommand({ listShards: 1 }),
  metadata: Mflix.config.collections.findOne({ _id: Mflix.namespace })
});
Mflix.snapshot('configuracion-vacia');
