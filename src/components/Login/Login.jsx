import './Login.css';
import Tim from "../../assets/imgs/TIM.jpg";
import Arklok from "../../assets/imgs/ARKLOK.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../api/authContext';
import { useState } from 'react';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, senha);
      navigate('/Planilha');
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="Login">
      <div className="areaLogin">
        <div className='areaDados'>
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">E-mail:</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="senha">Senha:</label>
              <input
                type="password"
                className="form-control"
                id="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className='botaoLogar'>
              <button type="submit" className="logar">Entrar</button>
              <button type="button" className="esqueci">Esqueci a senha</button>
            </div>
          </form>
        </div>
      </div>
      <div className="imagemArk">
        <img className="tim" src={Tim} alt="Tim" />
        <img className="arklok" src={Arklok} alt="Arklok" />
      </div>
    </div>
  );
}

export default Login;
