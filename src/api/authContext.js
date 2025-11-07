import { createContext, useContext, useState, useEffect } from "react"
import { login as loginService } from "./authService"
import { jwtDecode } from "jwt-decode"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("access_token"))
  const [usuario, setUsuario] = useState(() => {
    const savedToken = localStorage.getItem("access_token")
    if (!savedToken) return null
    try {
      return jwtDecode(savedToken)
    } catch {
      localStorage.removeItem("access_token")
      return null
    }
  })

  const login = async (matricula, senha) => {
    setToken(null)
    setUsuario(null)
    localStorage.removeItem("access_token")

    try {
      const result = await loginService(matricula, senha)
      if (result?.access_token) {
        setToken(result.access_token)
        localStorage.setItem("access_token", result.access_token)
        setUsuario(jwtDecode(result.access_token))
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

  return (
    <AuthContext.Provider
      value={{ token, usuario, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
