import "./Nav.css"
import React from "react"
import { Link } from "react-router-dom"


export default () => {
 

  return (
    <div className="nav">
      <nav className="menu">
            <Link to="/Planilha">
              <i >Planilha</i>
            </Link>
            <Link to="/Home">
              <i >Estoque</i>
            </Link>
            <Link to="/Entrada">
              <i >Entrada de equipamento</i>
            </Link>
            <Link to="/Saida">
              <i >Saída de equipamento</i>
            </Link>
            <Link to="/Cadastro">
              <i >Cadastro manual</i>
            </Link>
        </nav>
    </div>
  )
}