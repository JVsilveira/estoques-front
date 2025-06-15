import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"

const RotaAdmin = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
        return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode(token);

    // Verifica se o token possui role ADMIN
    const role = decoded.role || decoded.roles || decoded.perfil; // ajuste conforme seu token

    const isAdmin =
      role === "ADMIN" ||
      (Array.isArray(role) && role.includes("ADMIN"));

    if (isAdmin) {
      return children;
    } else {
      return Error("Usuário não autorizado para acessar esta rota.")
      ;
    }
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return <Navigate to="/login" />;
  }
};

export default RotaAdmin;
