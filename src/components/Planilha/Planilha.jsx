import React, { useContext, useEffect, useState } from "react"
import * as XLSX from "xlsx"
import "./Planilha.css"
import { TransferEntrada } from "../Transfer/TransferEntrada"
import { TransferSaida } from "../Transfer/TransferSaida"
import axios from "axios"
import { jwtDecode } from "jwt-decode"

function Planilha() {
  const { data } = useContext(TransferEntrada)
  const { itemSaiu } = useContext(TransferSaida)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState(null)
  const [quantidades, setQuantidades] = useState({})

  const token = localStorage.getItem("token")
  const decodedToken = token ? jwtDecode(token) : {}
  const role = decodedToken?.role || ""
  const regiaoToken = decodedToken?.regiao || ""

  const dados = Array.isArray(quantidades) ? quantidades : []

  const [filters, setFilters] = useState({
    tipo: "",
    serialNumber: "",
    modelo: "",
    marca: "",
    notaFiscal: "",
    disponibilidade: "",
  })

  const [regiaoSelecionada, setRegiaoSelecionada] = useState(
    role === "ADMIN" ? "TODAS" : ""
  )
  const [regioesDisponiveis, setRegioesDisponiveis] = useState([
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
  ])

  const handleFilterChange = (e, campo) => {
    setFilters({ ...filters, [campo]: e.target.value })
  }

  const verificarStatusUso = item => {
    return itemSaiu.some(
      saido =>
        saido.serialNumber === item.serialNumber &&
        saido.modelo === item.modelo &&
        saido.marca === item.marca
    )
  }

  useEffect(() => {
    if (!regiaoSelecionada && role === "ADMIN") return

    setLoading(true)
    setErro(null)

    const rotaAPI =
      role === "ADMIN"
        ? regiaoSelecionada === "TODAS"
          ? "http://localhost:8080/admin/planilha"
          : `http://localhost:8080/admin/planilha/${regiaoSelecionada}`
        : `http://localhost:8080/planilha/${regiaoToken}`

    axios
      .get(rotaAPI)
      .then(response => {
        console.log("✅ Dados carregados da API")
        setQuantidades(response.data)
      })
      .catch(error => {
        console.error("⚠️ Erro na API, carregando dados mockados:", error)

        // Dados mockados de exemplo
        const dadosMockados = [
          {
            tipo: "Notebook",
            serialNumber: "ABC12345",
            modelo: "Dell Latitude 5420",
            marca: "Dell",
            notaFiscal: "NF12345",
            disponibilidade: "Em estoque",
          },
          {
            tipo: "Monitor",
            serialNumber: "XYZ98765",
            modelo: "Samsung 24",
            marca: "Samsung",
            notaFiscal: "NF54321",
            disponibilidade: "Em estoque",
          },
        ]

        setQuantidades(dadosMockados)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [regiaoSelecionada, role, regiaoToken])

  const dadosFiltrados = dados.filter(item => {
    return (
      item.tipo?.toLowerCase().includes(filters.tipo.toLowerCase()) &&
      item.serialNumber
        ?.toLowerCase()
        .includes(filters.serialNumber.toLowerCase()) &&
      item.modelo?.toLowerCase().includes(filters.modelo.toLowerCase()) &&
      item.marca?.toLowerCase().includes(filters.marca.toLowerCase()) &&
      item.notaFiscal
        ?.toLowerCase()
        .includes(filters.notaFiscal.toLowerCase()) &&
      (filters.disponibilidade === "" ||
        (filters.disponibilidade === "Em estoque" &&
          (item.disponibilidade || "") === "Em estoque") ||
        (filters.disponibilidade === "Em uso" && verificarStatusUso(item)))
    )
  })
  const exportToExcel = () => {
    if (dadosFiltrados.length === 0) {
      alert("Nenhum dado para exportar!")
      return
    }

    const dadosParaExportar = dados.map(item => ({
      Tipo: item.tipo || "N/A",
      SerialNumber: item.serialNumber || "N/A",
      Modelo: item.modelo || "N/A",
      Marca: item.marca || "N/A",
      NotaFiscal: item.notaFiscal || "N/A",
      Disponibilidade: item.disponibilidade || "N/A",
    }))

    const ws = XLSX.utils.json_to_sheet(dadosParaExportar)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Planilha")
    XLSX.writeFile(wb, "planilha.xlsx")
  }

  return (
    <div className="planilha">
      <div className="inserir">
        <div className="titulo">PLANILHA</div>

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

        {!loading && dados.length > 0 && (
          <div className="planilha-container">
            <table className="planilha-tabela">
              <thead>
                <tr>
                  {[
                    "Tipo",
                    "Serial Number",
                    "Modelo",
                    "Marca",
                    "Nota Fiscal",
                    "Disponibilidade",
                  ].map((campo, idx) => (
                    <th key={idx}>
                      {campo}
                      <br />
                      {campo === "Disponibilidade" ? (
                        <select
                          value={filters.disponibilidade}
                          onChange={e =>
                            handleFilterChange(e, "disponibilidade")
                          }
                        >
                          <option value="">Todos</option>
                          <option value="Em estoque">Em estoque</option>
                          <option value="Em uso">Em uso</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={filters[campo.replace(" ", "").toLowerCase()]}
                          onChange={e =>
                            handleFilterChange(
                              e,
                              campo.replace(" ", "").toLowerCase()
                            )
                          }
                          placeholder="Filtrar"
                        />
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dadosFiltrados.map((item, index) => {
                  const emUso = verificarStatusUso(item)
                  const disponibilidade =
                    (item.disponibilidade === "Em estoque" && "Em estoque") ||
                    (emUso && "Em uso") ||
                    "N/A"

                  return (
                    <tr key={index}>
                      <td>{item.tipo || "N/A"}</td>
                      <td>{item.serialNumber || "N/A"}</td>
                      <td>{item.modelo || "N/A"}</td>
                      <td>{item.marca || "N/A"}</td>
                      <td>{item.notaFiscal || "N/A"}</td>
                      <td
                        style={{
                          color:
                            disponibilidade === "Em estoque" ? "green" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {disponibilidade}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <button onClick={exportToExcel} className="btn-download">
          Baixar Excel
        </button>
      </div>
    </div>
  )
}

export default Planilha
