import './Login.css';
import Tim from "../../assets/imgs/TIM.jpg";
import Arklok from "../../assets/imgs/ARKLOK.png";
import { useNavigate } from "react-router-dom"

function Login() {
  const navigate = useNavigate()
  const planilha = async () => {
    navigate("/Planilha")
  }
  
  return (
    <div className="Login">
      <div className="areaLogin">
        <div className='areaDados'>
          <h1>Login</h1>
          <form>
            <div className="form-group">
              <label htmlFor="email">E-mail:</label>
              <input type="email" className="form-control" id="email" name="email" />
            </div>
            <div className="form-group">
              <label htmlFor="senha">Senha:</label>
              <input type="password" className="form-control" id="senha" name="senha" />
            </div>
            <div className='botaoLogar'><button  onClick= {planilha} type="submit" className="logar">Entrar</button><button type="submit" className="esqueci">Esqueci a senha</button> </div>
          </form>
        </div>
        
      </div>
      <div className="imagemArk"> 
        <img className= "tim" src={Tim} alt="Tim" />
        <img className= "arklok" src={Arklok} alt="Arklok" />
        </div>
    </div>
  );
}

export default Login;