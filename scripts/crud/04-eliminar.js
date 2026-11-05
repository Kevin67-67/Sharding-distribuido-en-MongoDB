load('/scripts/lib/comun.js');
Mflix.snapshot('antes-eliminacion');
const eliminaciones=[];
for(const id_movie of [9000001,9000002,9000003]) {
  Mflix.snapshot('antes-eliminacion-'+id_movie);
  const filtro={id_movie,tipo_practica:'crud-mflix'};
  const resultado=Mflix.movies.deleteOne(filtro,{writeConcern:{w:'majority'}});
  eliminaciones.push({filtro,resultado,lecturaPosterior:Mflix.movies.findOne(filtro)});
  Mflix.snapshot('despues-eliminacion-'+id_movie);
}
Mflix.guardar('crud-eliminacion',{operacion:'deleteOne',eliminaciones});
Mflix.snapshot('despues-eliminacion');
