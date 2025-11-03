// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react"
import { login as loginService } from "./authService"
import { jwtDecode } from "jwt-decode"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("access_token"))
  const [usuario, setUsuario] = useState(() => {
    const savedToken = localStorage.getItem("access_token")
    try {
      return savedToken ? jwtDecode(savedToken) : null
    } catch (error) {
      console.error("Token inválido:", error)
      localStorage.removeItem("access_token")
      return null
    }
  })

  const login = async (username, password) => {
    try {
      const result = await loginService(username, password)
      if (result?.access_token) {
        setToken(result.access_token)
        localStorage.setItem("access_token", result.access_token)
        const decoded = jwtDecode(result.access_token)
        setUsuario(decoded)
      } else {
        throw new Error("Token não retornado pela API")
      }
    } catch (err) {
      console.error("Erro no login:", err)
      throw err
    }
  }

  const logout = () => {
    setToken(null)
    setUsuario(null)
    localStorage.removeItem("access_token")
  }

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUsuario(decoded)
      } catch (error) {
        console.error("Erro ao decodificar token:", error)
        logout()
      }
    }
  }, [token])

  return (
    <AuthContext.Provider value={{ token, usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
