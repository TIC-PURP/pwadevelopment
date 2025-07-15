import PouchDB from 'pouchdb';

const remoteDB = new PouchDB(`${process.env.NEXT_PUBLIC_COUCHDB_URL}/${process.env.NEXT_PUBLIC_COUCHDB_NAME}`);

export default remoteDB;