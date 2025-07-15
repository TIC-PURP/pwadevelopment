import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/auth-context';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function AdminPage() {
  const { roles } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!roles.includes('admin')) {
      alert('Acceso restringido solo a administradores');
      router.push('/');
    }
  }, [roles]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Zona Administrativa</h1>
      <p>Bienvenido. Aquí puedes hacer tareas administrativas.</p>
    </div>
  );
}

export default function AdminProtected() {
  return (
    <ProtectedRoute>
      <AdminPage />
    </ProtectedRoute>
  );
}