// Consultas de monitoreo y almacenamiento de las salidas de MongoDB

globalThis.Mflix = (() => {
  const fs = require('fs');
  const namespace = 'sample_mflix.movies';
  const admin = db.getSiblingDB('admin');
  const config = db.getSiblingDB('config');
  const movies = db.getSiblingDB('sample_mflix').movies;

  function guardar(etapa, datos) {
    const registro = { etapa, fecha: new Date(), ...datos };
    const nombre = `${Date.now()}-${etapa}-${Math.random().toString(16).slice(2, 8)}.json`;
    fs.mkdirSync('/evidencias', { recursive: true });
    fs.writeFileSync('/evidencias/' + nombre,
      EJSON.stringify(registro, null, 2, { relaxed: true }));
    print('EVIDENCIA: ' + nombre);
    printjson(registro);
    return registro;
  }

  function snapshot(etapa) {
    const meta = config.collections.findOne({ _id: namespace });
    const rangos = config.chunks.aggregate([
      { $match: { uuid: meta.uuid } },
      { $group: { _id: '$shard', rangos: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]).toArray();
    const distribucion = admin.aggregate([
      { $shardedDataDistribution: {} },
      { $match: { ns: namespace } }
    ]).toArray();
    const balance = admin.runCommand({ balancerCollectionStatus: namespace });
    return guardar(etapa, {
      total: movies.countDocuments({}), shardKey: meta.key,
      rangos, distribucion, balance
    });
  }

  return { namespace, admin, config, movies, guardar, snapshot, fs };
})();
