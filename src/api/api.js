import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Função isolada para obter token
const getToken = () => {
  return localStorage.getItem("token");
};

// Interceptor de requisição
api.interceptors.request.use(
  config => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Interceptor de resposta
api.interceptors.response.use(
  response => response,
  error => {
    const { response } = error;

    if (process.env.NODE_ENV === "development") {
      console.error("Erro na resposta da API:", response || error);
    }

    // Tratamento específico para status
    if (response) {
      if (response.status === 401) {
        // Usuário não autorizado - talvez redirecionar ou deslogar
        console.warn("Usuário não autorizado. Redirecionar para login.");
      } else if (response.status >= 500) {
        console.error("Erro interno no servidor.");
      }
    } else {
      console.error("Sem resposta do servidor. Verifique sua conexão.");
    }

    return Promise.reject(error);
  }
);

export default api;