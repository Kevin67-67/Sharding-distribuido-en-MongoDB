load('/scripts/lib/comun.js');
const estados=[];
for(let n=1;n<=3;n++) {
  const conexion=new Mongo(`mongodb://shard${n}:27017,shard${n}b:27017,shard${n}c:27017/?replicaSet=shard${n}RS`);
  const admin=conexion.getDB('admin');
  const status=admin.runCommand({replSetGetStatus:1});
  const primary=status.members.find(m=>m.stateStr==='PRIMARY');
  const primaryTime=primary?.optimeDate;
  const miembros=[];
  for(const m of status.members) {
    const directo=new Mongo(`mongodb://${m.name}/?directConnection=true`);
    directo.setReadPref(m.stateStr==='SECONDARY'?'secondary':'primary');
    const muestra=directo.getDB('sample_mflix').movies.find({id_movie:1},{_id:1,id_movie:1,title:1}).toArray();
    miembros.push({host:m.name,estado:m.stateStr,optimeDate:m.optimeDate,muestra});
  }
  estados.push({replicaSet:status.set,primaryTime,miembros,estadoCompleto:status});
}
Mflix.guardar('replicacion',{estados,nota:'Una pelicula pertenece a un shard; los tres miembros de ese shard mantienen copias, una muestra vacia en otro shard no es un error'});
