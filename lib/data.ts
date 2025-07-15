// data.ts: contiene funciones reutilizables para guardar y leer datos desde la base local.

import localDB from './pouchdb';
import { useAuth } from './auth-context';

export const guardarDato = async (dato: { nombre: string }, usuario: string) => {
  const nuevoDoc = {
    _id: new Date().toISOString(),
    tipo: 'registro',
    usuario,
    ...dato,
  };

  try {
    const result = await localDB.put(nuevoDoc);
    return result;
  } catch (err) {
    console.error('Error al guardar:', err);
    throw err;
  }
};

export const leerDatos = async (usuario: string) => {
  try {
    const result = await localDB.find({
      selector: {
        tipo: 'registro',
        usuario: usuario
      }
    });
    return result.docs;
  } catch (err) {
    console.error('Error al leer datos:', err);
    return [];
  }
};