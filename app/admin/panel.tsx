import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/router';
import PouchDB from 'pouchdb';

const remoteUsersDB = new PouchDB(`${process.env.NEXT_PUBLIC_COUCHDB_URL}/_users`, { skip_setup: true });
const remoteMainDB = new PouchDB(`${process.env.NEXT_PUBLIC_COUCHDB_URL}/${process.env.NEXT_PUBLIC_COUCHDB_NAME}`);

function AdminPanel() {
  const { roles } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<any[]>([]);
  const [docs, setDocs] = useState<any[]>([]);

  useEffect(() => {
    if (!roles.includes('admin')) {
      alert('Acceso restringido solo a administradores');
      router.push('/');
    } else {
      cargarUsuarios();
      cargarDocumentos();
    }
  }, [roles]);

  const cargarUsuarios = async () => {
    try {
      const result = await remoteUsersDB.allDocs({ include_docs: true });
      const usuarios = result.rows
        .map((r) => r.doc)
        .filter((doc) => doc && (doc as any).type === 'user');
      setUsers(usuarios);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
    }
  };

  const cargarDocumentos = async () => {
    try {
      const result = await remoteMainDB.allDocs({ include_docs: true });
      setDocs(result.rows.map((r) => r.doc));
    } catch (err) {
      console.error('Error al obtener documentos:', err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>

      <h2 className="text-xl mt-6 font-semibold">👥 Usuarios</h2>
      <ul className="list-disc ml-6">
        {users.map((u) => (
          <li key={u._id}>
            {u.name} — roles: [{u.roles?.join(', ') || 'ninguno'}]
          </li>
        ))}
      </ul>

      <h2 className="text-xl mt-6 font-semibold">📄 Documentos en la base</h2>
      <ul className="list-disc ml-6">
        {docs.map((d) => (
          <li key={d._id}>
            {d.nombre} — usuario: {d.usuario}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PanelPage() {
  return (
    <ProtectedRoute>
      <AdminPanel />
    </ProtectedRoute>
  );
}