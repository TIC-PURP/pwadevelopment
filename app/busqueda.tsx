import { useState } from 'react';
import { buscarPorNombre } from '@/lib/queries';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/auth-context';

type MiDocumento = {
  _id: string;
  nombre: string;
};

function BusquedaPage() {
  const [nombre, setNombre] = useState<string>('');
  const [resultados, setResultados] = useState<MiDocumento[]>([]);
  const { user } = useAuth();

  const buscar = async () => {
    if (!user) {
      console.warn('Usuario no autenticado');
      return;
    }

    if (!nombre.trim()) {
      console.warn('Nombre vacío');
      return;
    }

    try {
      const res: PouchDB.Core.ExistingDocument<MiDocumento>[] = await buscarPorNombre(nombre, user);
      setResultados(res);
    } catch (error) {
      console.error('Error al buscar:', error);
    }
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Buscar por nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="border px-2 py-1"
      />
      <button
        onClick={buscar}
        className="bg-blue-500 text-white px-4 py-2 ml-2"
      >
        Buscar
      </button>

      <ul className="mt-4">
        {resultados.map((r) => (
          <li key={r._id}>{r.nombre}</li>
        ))}
      </ul>
    </div>
  );
}

export default function ProtectedBusqueda() {
  return (
    <ProtectedRoute>
      <BusquedaPage />
    </ProtectedRoute>
  );
}
