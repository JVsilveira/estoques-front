import { createContext, useContext, useState } from 'react';
import { login as loginService } from '../api/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const login = async (email, senha) => {
    try {
      const data = await loginService(email, senha);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      setUser({ email });  // ou mais dados conforme sua API
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);