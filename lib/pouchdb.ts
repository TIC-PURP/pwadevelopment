// pouchdb.ts: instancia local de la base de datos usando PouchDB.

import PouchDB from 'pouchdb';

const localDB = new PouchDB('pwadatos_local');

export default localDB;