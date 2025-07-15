import { createContext, useContext, useEffect, useState } from 'react';
import remoteAuthDB from './auth-db';

type AuthContextType = {
  user: string | null;
  roles: string[];
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  roles: [],
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    try {
      const session = await remoteAuthDB.getSession();
      if (session?.userCtx?.name) {
        setUser(session.userCtx.name);
        setRoles(session.userCtx.roles || []);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (username: string, password: string) => {
    await remoteAuthDB.logIn(username, password);
    const session = await remoteAuthDB.getSession();
    setUser(session.userCtx.name);
    setRoles(session.userCtx.roles || []);
  };

  const logout = async () => {
    await remoteAuthDB.logOut();
    setUser(null);
    setRoles([]);
  };

  return (
    <AuthContext.Provider value={{ user, roles, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);