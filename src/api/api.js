import axios from "axios"

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor de requisição
api.interceptors.request.use(
  config => {
    // Aqui você pode adicionar token de autenticação futuramente
    const token = localStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

api.interceptors.response.use(
  response => response,
  error => {
    console.error("Erro na resposta da API:", error)
    return Promise.reject(error)
  }
)

export default api
