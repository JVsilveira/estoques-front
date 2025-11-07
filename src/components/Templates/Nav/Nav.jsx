import "./Nav.css"
import React from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../../api/authContext"

export default function Nav() {
  const { usuario } = useAuth()

  let isAdmin = false

  if (usuario?.role) {
    const role = usuario.role.toLowerCase() // case-insensitive
    isAdmin = role === "admin" || role === "administrador"
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
  )
}
