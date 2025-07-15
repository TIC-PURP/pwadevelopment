// /lib/pouchdb-helpers.ts (puedes renombrar tu archivo actual a este)
import localDB from "./registro-db";
import { v4 as uuidv4 } from "uuid";
import type PouchDB from "pouchdb-core";
import type { MiDocumento } from "./types";

/**
 * Guarda un nuevo documento con validación y _id autogenerado
 */
export const guardarDato = async (
  dato: Pick<MiDocumento, "nombre" | "usuario">
): Promise<PouchDB.Core.Response> => {
  if (!dato.nombre || !dato.usuario) {
    throw new Error("Faltan campos obligatorios: 'nombre' y 'usuario'");
  }

  const nuevoDoc: MiDocumento = {
    _id: `registro:${uuidv4()}`,
    tipo: "registro",
    ...dato,
  };

  try {
    const result = await localDB.put(nuevoDoc);
    return result;
  } catch (err) {
    console.error("Error al guardar:", err);
    throw err;
  }
};

/**
 * Lee todos los registros de un usuario
 */
export const leerDatos = async (
  usuario: string
): Promise<PouchDB.Core.ExistingDocument<MiDocumento>[]> => {
  try {
    const result = await localDB.find({
      selector: {
        tipo: "registro",
        usuario,
      },
    });
    return result.docs as PouchDB.Core.ExistingDocument<MiDocumento>[];
  } catch (err) {
    console.error("Error al leer datos:", err);
    return [];
  }
};
