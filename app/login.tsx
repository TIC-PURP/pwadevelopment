import { useState } from 'react';
import { login, logout } from '@/lib/auth';

export default function LoginPage() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = async () => {
    try {
      await login(user, pass);
      alert('Login exitoso');
    } catch {
      alert('Fallo en login');
    }
  };

  return (
    <div className="p-4">
      <input placeholder="usuario" onChange={(e) => setUser(e.target.value)} />
      <input placeholder="contraseña" type="password" onChange={(e) => setPass(e.target.value)} />
      <button onClick={handleLogin} className="bg-green-600 text-white px-4 py-2 mt-2 rounded">
        Iniciar sesión
      </button>
      <button onClick={logout} className="bg-red-500 text-white px-4 py-2 mt-2 rounded">
        Cerrar sesión
      </button>
    </div>
  );
}