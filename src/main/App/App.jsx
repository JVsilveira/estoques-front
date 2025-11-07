import "./App.css"
import Routes from "../Routes/Routes"
import { AuthProvider } from "../../api/authContext"

export default () => (
  <div className="App">
    <AuthProvider>
      <Routes />
    </AuthProvider>
  </div>
)
