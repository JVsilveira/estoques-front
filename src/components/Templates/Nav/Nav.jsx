import "./Nav.css";
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../api/authContext";

export default function Nav() {
  const { usuario } = useAuth();

  let isAdmin = false;

  if (usuario) {
    const roles =
      usuario.role ||
      usuario.roles ||
      usuario.authorities ||
      usuario.perfil ||
      [];

    isAdmin =
      roles === "ADMIN" ||
      roles === "ROLE_ADMIN" ||
      (Array.isArray(roles) &&
        (roles.includes("ADMIN") || roles.includes("ROLE_ADMIN")));
  }

  return (
    <div className="nav">
      <nav className="menu">
        <Link to="/Planilha">
          <i>Planilha</i>
        </Link>
        <Link to="/Home">
          <i>Estoque</i>
        </Link>
        <Link to="/Entrada">
          <i>Entrada de equipamento</i>
        </Link>
        <Link to="/Saida">
          <i>Saída de equipamento</i>
        </Link>
        <Link to="/Cadastro">
          <i>Cadastro manual</i>
        </Link>

        {isAdmin && (
          <Link to="/CadastroUser">
            <i>Cadastro de Usuário</i>
          </Link>
        )}
      </nav>
    </div>
  );
}
