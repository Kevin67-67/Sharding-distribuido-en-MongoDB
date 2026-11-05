load('/scripts/lib/comun.js');
Mflix.snapshot('antes-insercion');

// Identificadores reservados para esta demostración, como extra de los 21349 importados
const resultado=Mflix.movies.insertMany([
  {_id:ObjectId('6a0000000000000000000001'),id_movie:9000001,title:'La última proyección',year:2026,genres:['Drama'],runtime:104,languages:['Spanish'],countries:['Mexico'],directors:['Elena Navarro'],plot:'Una proyeccionista recupera el cine de su barrio.',tipo_practica:'crud-mflix'},
  {_id:ObjectId('6a0000000000000000000002'),id_movie:9000002,title:'Órbita del desierto',year:2025,genres:['Sci-Fi','Adventure'],runtime:118,languages:['Spanish'],countries:['Mexico'],directors:['Daniel Ríos'],plot:'Un equipo científico busca señales desde el desierto.',tipo_practica:'crud-mflix'},
  {_id:ObjectId('6a0000000000000000000003'),id_movie:9000003,title:'Cartas de noviembre',year:2024,genres:['Romance','Drama'],runtime:96,languages:['Spanish'],countries:['Spain'],directors:['Lucía Campos'],plot:'Dos desconocidos reconstruyen una historia mediante cartas.',tipo_practica:'crud-mflix'}
],{writeConcern:{w:'majority'}});
Mflix.guardar('crud-insercion',{operacion:'insertMany',resultado,documentos:Mflix.movies.find({tipo_practica:'crud-mflix'}).sort({id_movie:1}).toArray()});
Mflix.snapshot('despues-insercion');
