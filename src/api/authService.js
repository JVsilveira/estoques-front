// authService.js
import axios from "axios"

const API_URL = "http://localhost:8080"

export const login = async (matricula, senha) => {
  if (process.env.NODE_ENV === "development") {
    // Permite acesso incondicional apenas ao admin
    if (matricula === "admin") {
      const payload = { role: "ADMIN", regiao: "SP" }
      const base64Payload = btoa(JSON.stringify(payload))
      const fakeToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${base64Payload}.fake-signature`
      return { token: fakeToken }
    }

    // Para os demais, faz uma validação fake (exemplo: senha precisa ser "1234")
    if (senha !== "1234") {
      throw new Error("Senha incorreta")
    }

    const payload = { role: "USER", regiao: "SP" }
    const base64Payload = btoa(JSON.stringify(payload))
    const fakeToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${base64Payload}.fake-signature`
    return { token: fakeToken }
  }

  // Em produção, consulta real à API
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      matricula,
      senha,
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Erro ao fazer login")
  }
}
