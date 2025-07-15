// /lib/registro-db.ts

import PouchDB from "pouchdb-browser";
import PouchFind from "pouchdb-find";
import type { MiDocumento } from "./types";

// Extiende PouchDB con el plugin de búsqueda
PouchDB.plugin(PouchFind);

// Instancia local con tipo seguro
const localDB: PouchDB.Database<MiDocumento> = new PouchDB("registro-agricola");

export default localDB;
