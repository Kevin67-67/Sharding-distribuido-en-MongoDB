// Concentracion manual de movies en shard1RS para preparar la demostracion

load('/scripts/lib/comun.js');
const totalInicial = Mflix.movies.countDocuments({});
const meta = Mflix.config.collections.findOne({ _id: Mflix.namespace });
const estado = Mflix.admin.runCommand({ balancerCollectionStatus: Mflix.namespace });
const configuracionAnterior = {
  chunkSize: Number(estado.chunkSize),
  enableAutoMerger: meta.enableAutoMerger !== false,
  enableBalancing: meta.noBalance !== true
};

Mflix.snapshot('balanceo-inicial');
Mflix.guardar('balanceo-configuracion-previa', {
  uuid: meta.uuid, configuracionAnterior
});
printjson(Mflix.admin.runCommand({
  configureCollectionBalancing: Mflix.namespace,
  enableBalancing: false, enableAutoMerger: false
}));
sleep(5000);

const rangos = Mflix.config.chunks.find({
  uuid: meta.uuid, shard: { $ne: 'shard1RS' }
}).sort({ min: 1 }).toArray();
const movimientos = [];
for (const rango of rangos) {
  // Para una clave hashed se utilizan los limites del chunk
  const comando = {
    moveChunk: Mflix.namespace, bounds: [rango.min, rango.max],
    to: 'shard1RS', _waitForDelete: true
  };
  const respuesta = Mflix.admin.runCommand(comando);
  printjson(respuesta);
  movimientos.push({ comando, respuesta });
}

Mflix.guardar('balanceo-preparado', {
  uuid: meta.uuid, configuracionAnterior, movimientos,
  totalAntes: totalInicial, totalDespues: Mflix.movies.countDocuments({}),
  nota: 'Concentracion manual , la etapa siguiente activa el balanceador automatico'
});
Mflix.snapshot('balanceo-concentrado');
