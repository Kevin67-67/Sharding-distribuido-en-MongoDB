load('/scripts/lib/comun.js');
Mflix.snapshot('antes-consulta');
const consulta={id_movie:9000001};
const documentos=Mflix.movies.find(consulta).toArray();
const dirigida=Mflix.movies.find(consulta).explain('executionStats');
const distribuida=Mflix.movies.find({genres:'Drama'}).limit(5).explain('executionStats');
Mflix.guardar('crud-consulta',{operacion:'find',consulta,documentos,explainPorId:dirigida,explainPorGenero:distribuida});
Mflix.snapshot('despues-consulta');
