import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../../api/authContext"
import { jwtDecode } from "jwt-decode"
import "./Estoque.css"

function Estoque() {
  const { token, logout } = useAuth()
  const decoded = token ? jwtDecode(token) : null
  const role = decoded?.role?.toLowerCase() || "usuario"
  const regiaoToken = decoded?.regiao || null

  const regioesDisponiveis = [
    "TODAS",
    "PISA",
    "SIGMA",
    "LAPA",
    "TRJ",
    "CEO",
    "MG",
    "RS",
    "SEMINÁRIO",
    "CE",
    "BA",
    "PE",
    "PA",
    "DF",
  ]

  const [regiaoSelecionada, setRegiaoSelecionada] = useState(
    role === "administrador" ? "TODAS" : regiaoToken
  )

  const [dadosEstoque, setDadosEstoque] = useState({ perifericos: [], ativos: [], regiao: "" })
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState(null)

  // ---------------------------
  // 🔄 Buscar dados do backend
  // ---------------------------
  useEffect(() => {
    if (!token) return

    setLoading(true)
    setErro(null)

    // Monta a rota — sempre /estoque, com ?regiao= para admin
    const rotaAPI =
      role === "administrador"
        ? `http://localhost:8000/estoque${regiaoSelecionada && regiaoSelecionada !== "TODAS"
            ? `?regiao=${regiaoSelecionada}`
            : ""}`
        : "http://localhost:8000/estoque"

    axios
      .get(rotaAPI, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setDadosEstoque(response.data)
      })
      .catch((error) => {
        console.error("Erro ao buscar os dados da API:", error)
        setErro("Erro ao carregar os dados do estoque.")
        logout()
      })
      .finally(() => {
        setLoading(false)
      })
  }, [regiaoSelecionada, role, token])

  // ---------------------------
  // 🧾 Renderizar linha
  // ---------------------------
  const renderLinha = (item) => (
    <tr key={item.item}>
      <td>{item.item}</td>
      <td>
        <input type="number" value={item.quantidade} readOnly />
      </td>
    </tr>
  )

  // ---------------------------
  // 🖼️ Interface
  // ---------------------------
  return (
    <div className="Home">
      <div className="quantidades">
        <div className="titulo">ESTOQUE ARKLOK TIM</div>

        {role === "administrador" && (
          <div className="seletor-regiao">
            <label htmlFor="regiao" style={{ color: "black" }}>
              Selecione a região:
            </label>
            <select
              id="regiao"
              value={regiaoSelecionada}
              onChange={(e) => setRegiaoSelecionada(e.target.value)}
            >
              {regioesDisponiveis.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        )}

        {loading && <div className="load-dados">Carregando dados...</div>}
        {erro && <p style={{ color: "red" }}>{erro}</p>}

        {!loading && !erro && (
          <div className="ativos">
            <div className="tabelas-container-estoque">
              {/* PERIFÉRICOS */}
              <table className="tabela-estoque">
                <thead>
                  <tr>
                    <th>Periférico</th>
                    <th>Quantidade</th>
                  </tr>
                </thead>
                <tbody>
                  {dadosEstoque.perifericos.map(renderLinha)}
                </tbody>
              </table>

              {/* ATIVOS */}
              <table className="tabela-estoque">
                <thead>
                  <tr>
                    <th>Ativo</th>
                    <th>Quantidade</th>
                  </tr>
                </thead>
                <tbody>
                  {dadosEstoque.ativos.map(renderLinha)}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Estoque
