import { Navigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode" // ✅ import default

const RotaAdmin = ({ children }) => {
  const token = localStorage.getItem("access_token")

  if (!token) return <Navigate to="/login" />

  try {
    const decoded = jwtDecode(token)

    // Normaliza role: aceita 'admin' ou 'administrador' (case-insensitive)
    const role = decoded.role?.toLowerCase()

    if (role === "admin" || role === "administrador") {
      return children
    } else {
      return <div>Usuário não autorizado para acessar esta rota.</div>
    }
  } catch (error) {
    console.error("Erro ao decodificar token:", error)
    return <Navigate to="/login" />
  }
}

export default RotaAdmin
