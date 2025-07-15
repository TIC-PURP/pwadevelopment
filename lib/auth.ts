import remoteAuthDB from './auth-db';

export const login = async (username: string, password: string) => {
  try {
    const result = await remoteAuthDB.logIn(username, password);
    console.log('✅ Usuario autenticado:', result);
    return result;
  } catch (error) {
    console.error('❌ Error de login:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await remoteAuthDB.logOut();
    console.log('👋 Sesión cerrada');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};