import { createContext, useContext, useState } from "react";
import { login as loginService } from "./authService";
import {jwtDecode} from "jwt-decode"; // 🔹 import correto

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Estado do token
  const [token, setToken] = useState(() => localStorage.getItem("access_token"));

  // Estado do usuário decodificado
  const [usuario, setUsuario] = useState(() => {
    const savedToken = localStorage.getItem("access_token");
    if (!savedToken) return null;
    try {
      return jwtDecode(savedToken);
    } catch {
      localStorage.removeItem("access_token");
      return null;
    }
  });

  // Função de login
  const login = async (matricula, senha) => {
    try {
      const result = await loginService(matricula, senha);

      if (!result?.access_token) {
        throw new Error("Token não retornado pela API");
      }

      // Salva token no estado e localStorage
      setToken(result.access_token);
      localStorage.setItem("access_token", result.access_token);

      // Decodifica e salva usuário
      setUsuario(jwtDecode(result.access_token));
    } catch (err) {
      console.error("Erro no login:", err);
      throw err;
    }
  };

  // Função de logout
  const logout = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem("access_token");
  };

  return (
    <AuthContext.Provider
      value={{ token, usuario, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
