// configRS ya está inicializado en la actividad anterior
// Este archivo solo muestra y guarda su estado

load('/scripts/lib/comun.js');
Mflix.guardar('configRS', { estado: rs.status() });
