// /lib/queries.ts

import localDB from "./registro-db";
import type { MiDocumento } from "./types";
import type PouchDB from "pouchdb-core";
import { v4 as uuidv4 } from "uuid";

// 🔍 Crear índice
export const crearIndice = async () => {
  await localDB.createIndex({
    index: { fields: ["tipo", "nombre", "usuario"] },
  });
};

// 🔍 Buscar por nombre y usuario
export const buscarPorNombre = async (
  nombre: string,
  usuario: string
): Promise<PouchDB.Core.ExistingDocument<MiDocumento>[]> => {
  await crearIndice();

  const result = await localDB.find({
    selector: {
      tipo: "registro",
      usuario: usuario,
      nombre: { $regex: `(?i)^${nombre}` },
    },
  });

  return result.docs as PouchDB.Core.ExistingDocument<MiDocumento>[];
};

// ✅ Guardar registro (con _id automático si falta)
export const guardarRegistro = async (
  doc: Partial<MiDocumento>
): Promise<PouchDB.Core.Response> => {
  if (!doc.nombre || !doc.usuario) {
    throw new Error("Faltan campos obligatorios: nombre y usuario");
  }

  const documento: MiDocumento = {
    ...doc,
    _id: doc._id || `registro:${uuidv4()}`,
    tipo: "registro",
    usuario: doc.usuario,
    nombre: doc.nombre,
  };

  try {
    const response = await localDB.put(documento);
    console.log("Documento guardado:", response);
    return response;
  } catch (error) {
    console.error("Error al guardar el documento:", error);
    throw error;
  }
};

// 📄 Obtener por _id
export const obtenerPorId = async (
  _id: string
): Promise<PouchDB.Core.ExistingDocument<MiDocumento>> => {
  try {
    const doc = await localDB.get(_id);
    return doc as PouchDB.Core.ExistingDocument<MiDocumento>;
  } catch (error: any) {
    if (error.status === 404) {
      console.warn(`Documento no encontrado: ${_id}`);
    } else {
      console.error("Error al obtener el documento:", error);
    }
    throw error;
  }
};

// 🗑️ Eliminar por _id
export const eliminarRegistro = async (
  _id: string
): Promise<PouchDB.Core.Response> => {
  try {
    const doc = await localDB.get(_id);
    const response = await localDB.remove(doc);
    console.log(`Documento ${_id} eliminado`);
    return response;
  } catch (error: any) {
    if (error.status === 404) {
      console.warn(`Documento no encontrado: ${_id}`);
    } else {
      console.error("Error al eliminar documento:", error);
    }
    throw error;
  }
};
