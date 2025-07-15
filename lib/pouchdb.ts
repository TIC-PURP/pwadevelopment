import PouchDB from 'pouchdb';

const localDB = new PouchDB('pwadatos_local');

export default localDB;