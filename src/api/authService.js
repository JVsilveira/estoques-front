import axios from 'axios';

const API_URL = 'http://localhost:8080';  // ajuste conforme seu backend

export const login = async (email, senha) => {
  if (process.env.NODE_ENV === 'development') {
    // Simula uma resposta da API
    return Promise.resolve({ token: 'token-fixo-dev' });
  }

  // Caso um dia tenha backend real
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, senha });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Erro ao fazer login';
  }
};