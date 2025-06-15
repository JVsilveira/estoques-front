import { createContext, useContext, useState, useEffect } from "react";
import { login as loginService } from "./authService";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
 const [usuario, setUsuario] = useState(() => {
  const token = localStorage.getItem("token");
  try {
    return token ? jwtDecode(token) : null;
  } catch (error) {
    console.error("Token inválido:", error);
    localStorage.removeItem("token");
    return null;
  }
});

  const login = async (matricula, senha) => {
    const result = await loginService(matricula, senha);
    if (result?.token) {
      setToken(result.token);
      localStorage.setItem("token", result.token);
      const decoded = jwtDecode(result.token);
      setUsuario(decoded);
    } else {
      throw new Error("Token inválido");
    }
  };

  const logout = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUsuario(decoded);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
