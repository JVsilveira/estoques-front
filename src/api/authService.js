// src/context/authService.js
import axios from "axios"

const API_URL = "http://localhost:8080" // FastAPI roda por padrão nessa porta

export const login = async (matricula, senha) => {
  if (process.env.NODE_ENV === "development") {
    // Simulação local (modo dev)
    if (matricula === "admin") {
      const payload = { sub: 1, role: "admin", region: "SP" }
      const base64Payload = btoa(JSON.stringify(payload))
      const fakeToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${base64Payload}.fake-signature`
      return { access_token: fakeToken }
    }

    if (senha !== "1234") {
      throw new Error("Senha incorreta")
    }

    const payload = { sub: 2, role: "user", region: "SP" }
    const base64Payload = btoa(JSON.stringify(payload))
    const fakeToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${base64Payload}.fake-signature`
    return { access_token: fakeToken }
  }

  // 🔐 Login real (produção)
  try {
    // FastAPI espera form-urlencoded, não JSON
    const formData = new URLSearchParams()
    formData.append("username", matricula)
    formData.append("password", senha)

    const response = await axios.post(`${API_URL}/token`, formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })

    // FastAPI retorna: { "access_token": "...", "token_type": "bearer" }
    return response.data
  } catch (error) {
    console.error("Erro ao autenticar:", error)
    throw new Error(error.response?.data?.detail || "Erro ao fazer login")
  }
}
