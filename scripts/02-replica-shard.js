// Ampliación inicial: ejecutar una sola vez en cada shard original

load('/scripts/lib/comun.js');
const seed = process.env.RS_SEED;

printjson(rs.add({ host: `${seed}b:27017` }));
sleep(15000);
printjson(rs.add({ host: `${seed}c:27017` }));
sleep(15000);

Mflix.guardar(process.env.RS_NAME, { estado: rs.status() });
