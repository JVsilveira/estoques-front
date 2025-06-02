import { useEffect, useState } from "react"
import axios from "axios"
import "./Estoque.css"

function Estoque() {
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
    setLoading(true)
    setErro(null)
    axios
      .get("URL_DA_API")
      .then(response => {
        // Supondo que a API retorne um objeto { "Item": quantidade, ... }
        setQuantidades(prev => ({
          ...prev,
          ...response.data,
        }))
      })
      .catch(error => {
        console.error("Erro ao buscar os dados da API:", error)
        setErro("Erro ao carregar os dados.")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

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
        <div className="ativos">
          <div className="tabelas-container-estoque">
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
      </div>
    </div>
  )
}

export default Estoque
