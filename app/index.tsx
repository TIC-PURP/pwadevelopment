import { useEffect, useState } from 'react';
import { guardarDato, leerDatos } from '@/lib/data';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/auth-context';

function IndexPage() {
  const [datos, setDatos] = useState<any[]>([]);
  const { user } = useAuth();

  const handleGuardar = async () => {
    await guardarDato({ nombre: `Registro ${Date.now()}` }, user!);
    const nuevos = await leerDatos(user!);
    setDatos(nuevos);
  };

  useEffect(() => {
    if (user) {
      leerDatos(user).then(setDatos);
    }
  }, [user]);

  return (
    <main className="p-4">
      <button onClick={handleGuardar} className="bg-blue-500 text-white px-4 py-2 rounded">
        Agregar Registro
      </button>
      <ul className="mt-4">
        {datos.map((d) => (
          <li key={d._id}>{d.nombre}</li>
        ))}
      </ul>
    </main>
  );
}

export default function ProtectedHome() {
  return (
    <ProtectedRoute>
      <IndexPage />
    </ProtectedRoute>
  );
}