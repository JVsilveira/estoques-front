import { useState } from "react";
import axios from "axios";
import "./CadastroUser.css";

const CadastroUser = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [matricula, setMatricula] = useState("");
  const [role, setRole] = useState("USER"); // USER ou ADMIN

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8080/api/admin/cadastrar",
        {
          nome,
          matricula,
          email,
          senha,
          role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          
        },
        console.log("Dados enviados:", {nome, matricula, email, senha, role})
      );
      

      alert("Usuário cadastrado com sucesso!");
      setNome("");
      setMatricula("");
      setEmail("");
      setSenha("");
      setRole("");
    } catch (error) {
      console.error("Erro ao cadastrar usuário", error);
      alert("Erro ao cadastrar usuário.");
      setNome("");
      setMatricula("");
      setEmail("");
      setSenha("");
      setRole("");
    }
  };

  return (
   
      <div className="entrada">
      <div className="inserir">
        <div className="titulo">CADASTRO DE USUÁRIO</div>
        
      <div className="form-user">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Matrícula"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="USER">Usuário</option>
          <option value="ADMIN">Administrador</option>
        </select>
        <button type="submit">Cadastrar</button>
      </form>
      </div>
    </div>
    </div>
  );
};

export default CadastroUser;