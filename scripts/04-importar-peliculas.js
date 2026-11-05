// Carga inicial: ejecutar una sola vez desde mongos
load('/scripts/lib/comun.js');
const zlib = require('zlib');
const manifest = JSON.parse(Mflix.fs.readFileSync('/datos/manifest.json', 'utf8'));
const compressed = Mflix.fs.readFileSync('/datos/sample_mflix.movies.json.gz');
const bytes = zlib.gunzipSync(compressed);

// EJSON conserva ObjectId, Date y los tipos BSON del archivo original
const peliculas = EJSON.parse(bytes.toString('utf8'), { relaxed: false });
const inicio = new Date();

for (let start = 0; start < peliculas.length; start += 500) {
  const batch = peliculas.slice(start, start + 500)
    .map((movie, i) => ({ ...movie, id_movie: start + i + 1 }));
  const result = Mflix.movies.insertMany(batch, {
    ordered: true, writeConcern: { w: 'majority' }
  });
  printjson({
    lote: Math.floor(start / 500) + 1,
    insertados: Object.keys(result.insertedIds).length,
    acknowledged: result.acknowledged
  });
}

Mflix.guardar('carga', {
  inicio, fin: new Date(), fuente: manifest,
  total: Mflix.movies.countDocuments({}),
  ejemplo: Mflix.movies.findOne({ id_movie: 1 })
});
Mflix.snapshot('despues-carga');
