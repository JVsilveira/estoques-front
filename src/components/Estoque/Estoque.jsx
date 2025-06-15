import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../../api/authContext"
import { jwtDecode } from "jwt-decode"
import "./Estoque.css"

function Estoque() {
  const { token } = useAuth()
  const decoded = token ? jwtDecode(token) : null
  const role = decoded?.role || "USER"
  const regiaoToken = decoded?.regiao || "SP" // para usuários comuns

  const regioesDisponiveis = ["PISA", "SIGMA", "LAPA", "TRJ", 'CEO', "MG", "RS", 'SEMINÁRIO', "CE", "BA", 'PE','PA', "DF" ]

  const [regiaoSelecionada, setRegiaoSelecionada] = useState(
    role === "ADMIN" ? "TODAS" : regiaoToken
  )

  const [quantidades, setQuantidades] = useState({
    "Teclado com fio": 0,
    "Mouse com fio": 0,
    "Teclado/Mouse com fio": 0,
    Mochila: 0,
    "Suporte Ergonômico": 0,
    "Headset Bilateral": 0,
    "Headset Unilateral": 0,
    "Cabo de segurança": 0,
    "HUB usb": 0,
    Dockstation: 0,
    "Headset premium": 0,
    Webcam: 0,
    "Mouse sem fio": 0,
    "Teclado sem fio": 0,
    "LENOVO T14 G2": 0,
    "LENOVO T14 G4": 0,
    "LENOVO NEO 50Q": 0,
    "LENOVO M80Q": 0,
    "LENOVO S22E": 0,
    "LENOVO T22": 0,
    "DELL P2422H": 0,
  })

  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    if (!regiaoSelecionada) return

    setLoading(true)
    setErro(null)

    if (process.env.NODE_ENV === "development") {
      console.log("🔧 Ambiente de desenvolvimento: carregando dados fake.")

      const dadosFake = {
        "Teclado com fio": 5,
        "Mouse com fio": 3,
        "Teclado/Mouse com fio": 2,
        Mochila: 4,
        "Suporte Ergonômico": 1,
        "Headset Bilateral": 3,
        "Headset Unilateral": 2,
        "Cabo de segurança": 5,
        "HUB usb": 3,
        Dockstation: 1,
        "Headset premium": 2,
        Webcam: 3,
        "Mouse sem fio": 2,
        "Teclado sem fio": 4,
        "LENOVO T14 G2": 1,
        "LENOVO T14 G4": 0,
        "LENOVO NEO 50Q": 3,
        "LENOVO M80Q": 2,
        "LENOVO S22E": 1,
        "LENOVO T22": 1,
        "DELL P2422H": 2,
      }

      setTimeout(() => {
        setQuantidades(prev => ({ ...prev, ...dadosFake }))
        setLoading(false)
      }, 1000)
      return
    }

    const rotaAPI =
      role === "ADMIN"
        ? regiaoSelecionada === "TODAS"
          ? "http://localhost:8080/admin/estoque"
          : `http://localhost:8080/admin/estoque/${regiaoSelecionada}`
        : `http://localhost:8080/estoque/${regiaoToken}`

    axios
      .get(rotaAPI)
      .then(response => {
        setQuantidades(prev => ({ ...prev, ...response.data }))
      })
      .catch(error => {
        console.error("Erro ao buscar os dados da API:", error)
        setErro("Erro ao carregar os dados.")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [regiaoSelecionada, role, regiaoToken])

  const renderLinha = item => (
    <tr key={item}>
      <td>{item}</td>
      <td>
        <input type="number" value={quantidades[item]} readOnly />
      </td>
    </tr>
  )

  return (
    <div className="Home">
      <div className="quantidades">
        <div className="titulo">ESTOQUE ARKLOK TIM</div>

        {role === "ADMIN" && (
          <div className="seletor-regiao">
            <label htmlFor="regiao" style={{ color: "black" }}>
              Selecione a região:
            </label>
            <select
              id="regiao"
              value={regiaoSelecionada}
              onChange={e => {
                const novaRegiao = e.target.value
                console.log("Região selecionada:", novaRegiao)
                setRegiaoSelecionada(novaRegiao)
              }}
            >
              <option value="TODAS">Todas</option>
              {regioesDisponiveis.map(regiao => (
                <option key={regiao} value={regiao}>
                  {regiao}
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
              {/* TABELA 1 */}
              <table className="tabela-estoque">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantidade</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    "Teclado com fio",
                    "Mouse com fio",
                    "Teclado/Mouse com fio",
                    "Mochila",
                    "Suporte Ergonômico",
                    "Headset Bilateral",
                    "Headset Unilateral",
                  ].map(renderLinha)}
                </tbody>
              </table>

              {/* TABELA 2 */}
              <table className="tabela-estoque">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantidade</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    "Cabo de segurança",
                    "HUB usb",
                    "Dockstation",
                    "Headset premium",
                    "Webcam",
                    "Mouse sem fio",
                    "Teclado sem fio",
                  ].map(renderLinha)}
                </tbody>
              </table>

              {/* TABELA 3 */}
              <table className="tabela-estoque">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantidade</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    "LENOVO T14 G2",
                    "LENOVO T14 G4",
                    "LENOVO NEO 50Q",
                    "LENOVO M80Q",
                    "LENOVO S22E",
                    "LENOVO T22",
                    "DELL P2422H",
                  ].map(renderLinha)}
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
