import axios from "axios"

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000", // Ajuste da porta
  timeout: 10000,
  headers: {
    "Content-Type": "application/json", // padrão para JSON
  },
})

const getToken = () => localStorage.getItem("access_token")

api.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

api.interceptors.response.use(
  response => response,
  error => {
    const { response } = error

    if (process.env.NODE_ENV === "development") {
      console.error("Erro na resposta da API:", response || error)
    }

    if (response) {
      if (response.status === 401) {
        console.warn("Token inválido ou expirado. Redirecionando para login...")
        localStorage.removeItem("access_token")
        window.location.href = "/login"
      } else if (response.status >= 500) {
        console.error("Erro interno no servidor (500).")
      }
    } else {
      console.error("Sem resposta do servidor. Verifique sua conexão.")
    }

    return Promise.reject(error)
  }
)

export default api
