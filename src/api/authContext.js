import { createContext, useContext, useState } from "react"
import { login as loginService } from "./authService"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)

  const login = async (matricula, senha) => {
    const result = await loginService(matricula, senha)
    if (result?.token) {
      setToken(result.token)
    } else {
      throw new Error("Token inválido")
    }
  }

  return (
    <AuthContext.Provider value={{ token, login }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
