load('/scripts/lib/comun.js');
Mflix.snapshot('antes-actualizacion');
const filtro={id_movie:9000001,tipo_practica:'crud-mflix'};
const cambio={$set:{title:'La última proyección: edición restaurada',runtime:110,'imdb.rating':8.1}};
const resultado=Mflix.movies.updateOne(filtro,cambio,{writeConcern:{w:'majority'}});
Mflix.guardar('crud-actualizacion',{operacion:'updateOne',filtro,cambio,resultado,lecturaPosterior:Mflix.movies.findOne(filtro)});
Mflix.snapshot('despues-actualizacion');
