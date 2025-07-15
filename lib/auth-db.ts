import PouchDB from 'pouchdb';
import PouchAuth from 'pouchdb-authentication';

PouchDB.plugin(PouchAuth);

const remoteAuthDB = new PouchDB(
  `${process.env.NEXT_PUBLIC_COUCHDB_URL}/_users`,
  { skip_setup: true }
);

export default remoteAuthDB;