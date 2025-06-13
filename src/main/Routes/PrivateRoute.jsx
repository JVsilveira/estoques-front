import { Navigate } from "react-router-dom"
import { useAuth } from "../../api/authContext"

const PrivateRoute = ({ children }) => {
  const { token } = useAuth()
  return token ? children : <Navigate to="/" />
}

export default PrivateRoute
