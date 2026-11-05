// Observacion del balanceador: 12 muestras cada 10 segundos
load('/scripts/lib/comun.js');
const archivos = Mflix.fs.readdirSync('/evidencias')
  .filter(f => f.includes('-balanceo-preparado-') && f.endsWith('.json')).sort();
const preparado = EJSON.parse(
  Mflix.fs.readFileSync('/evidencias/' + archivos.at(-1), 'utf8')
);
const meta = Mflix.config.collections.findOne({ _id: Mflix.namespace });
const balanceadorGlobalAnterior = sh.getBalancerState();
const inicio = new Date();
const antes = Mflix.snapshot('balanceo-antes-automatico');
const iniciales = Mflix.config.chunks.find({ uuid: meta.uuid }).toArray()
  .map(c => ({ min: c.min, max: c.max, shard: c.shard }));

printjson(Mflix.admin.runCommand({
  configureCollectionBalancing: Mflix.namespace,
  chunkSize: 1, enableBalancing: true, enableAutoMerger: false
}));
sh.startBalancer();

for (let muestra = 1; muestra <= 12; muestra++) {
  sleep(10000);
  Mflix.snapshot('balanceo-muestra');
}

const despues = Mflix.snapshot('balanceo-despues-automatico');
const finales = Mflix.config.chunks.find({ uuid: meta.uuid }).toArray()
  .map(c => ({ min: c.min, max: c.max, shard: c.shard }));
const migraciones = Mflix.config.changelog.find({
  ns: Mflix.namespace, what: /moveChunk.commit/, time: { $gte: inicio }
}).toArray();

// Restauracion ordinaria al finalizar las muestras, sin bloques de recuperacion
const restaurado = Mflix.admin.runCommand({
  configureCollectionBalancing: Mflix.namespace,
  chunkSize: preparado.configuracionAnterior.chunkSize,
  enableAutoMerger: preparado.configuracionAnterior.enableAutoMerger,
  enableBalancing: preparado.configuracionAnterior.enableBalancing
});
printjson(restaurado);
// Esta condicion recupera el estado global previo
if (!balanceadorGlobalAnterior) sh.stopBalancer();

Mflix.guardar('balanceo-resumen', {
  inicio, fin: new Date(), antes, despues,
  rangosIniciales: iniciales, rangosFinales: finales, migraciones, restaurado,
  balanceadorGlobalAnterior, balanceadorGlobalActual: sh.getBalancerState(),
  nota: 'Comparar documentos, bytes y rangos antes/despues'
});

