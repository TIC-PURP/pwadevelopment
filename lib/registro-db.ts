import PouchDB from "pouchdb-browser";
import PouchFind from "pouchdb-find";
import type { MiDocumento } from "./types";

PouchDB.plugin(PouchFind);

const localDB: PouchDB.Database<MiDocumento> = new PouchDB("registro-agricola");

if (typeof window !== "undefined") {
  const remoteURL = process.env.NEXT_PUBLIC_COUCHDB_URL;

  if (remoteURL) {
    const remoteDB = new PouchDB<MiDocumento>(remoteURL, {
      skip_setup: true
    });

    localDB.sync(remoteDB, {
      live: true,
      retry: true
    }).on("change", info => {
      console.log("🔄 Cambios sincronizados:", info);
    }).on("error", err => {
      console.error("❌ Error de sincronización:", err);
    });
  }
}

export default localDB;
