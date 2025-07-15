import PouchDB from "pouchdb-browser";
import PouchFind from "pouchdb-find";

PouchDB.plugin(PouchFind);

// Declaración segura
let dbInstance: PouchDB.Database<any> | null = null;

/**
 * Retorna una única instancia segura del cliente PouchDB.
 */
export function getDB(): PouchDB.Database<any> {
  if (typeof window === "undefined") {
    throw new Error("PouchDB solo puede usarse en el cliente");
  }

  if (!dbInstance) {
    dbInstance = new PouchDB("registro-agricola");

    const syncUrl = process.env.NEXT_PUBLIC_COUCHDB_URL;
    if (syncUrl) {
      dbInstance
        .sync(syncUrl, { live: true, retry: true })
        .on("change", (info: any) => console.log("📥 Sync change:", info))
        .on("error", (err: any) => console.error("❌ Sync error:", err));
    }
  }

  return dbInstance;
}
