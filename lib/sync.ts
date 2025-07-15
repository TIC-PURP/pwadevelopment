// sync.ts: configura la sincronización automática entre PouchDB (local) y CouchDB (remoto).

import localDB from './pouchdb';
import remoteDB from './remote-db';

export const syncDatabases = () => {
  localDB
    .sync(remoteDB, {
      live: true,
      retry: true,
    })
    .on('change', (info) => {
      console.log('📦 Datos sincronizados:', info);
    })
    .on('paused', () => {
      console.log('⏸️ Sincronización pausada (sin conexión o sin cambios)');
    })
    .on('active', () => {
      console.log('🔄 Reanudando sincronización');
    })
    .on('error', (err) => {
      console.error('❌ Error de sincronización:', err);
    });
};