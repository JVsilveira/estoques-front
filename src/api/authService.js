// src/context/authService.js
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // 🔹 import correto

const API_URL = "http://localhost:8000"; // FastAPI

export const login = async (matricula, senha) => {
  try {
    // Envia JSON diretamente
    const response = await axios.post(
      `${API_URL}/login`,
      { matricula, senha }, // JSON simples
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    // FastAPI deve retornar: { "access_token": "...", "token_type": "bearer" }
    return response.data;
  } catch (error) {
    console.error("Erro ao autenticar:", error);

    const detail = error.response?.data?.detail;
    throw new Error(detail || "Erro ao fazer login");
  }
};

// ----------------------------
// Função auxiliar para debug
// ----------------------------
export const decodeToken = (token) => {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    console.log("Token decodificado:", decoded);
    return decoded;
  } catch (err) {
    console.error("Erro ao decodificar token:", err);
    return null;
  }
};
