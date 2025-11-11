import React, { useEffect, useState } from "react"
import * as XLSX from "xlsx"
import "./Planilha.css"
import axios from "axios"
import { useAuth } from "../../api/authContext"
 
function Planilha() {
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState(null)
  const [dados, setDados] = useState([])

  const { token, usuario, logout } = useAuth()
  const role = usuario?.role?.toUpperCase() || ""
  const regiaoToken = usuario?.regiao || ""

  const [filters, setFilters] = useState({
    tipo: "",
    serialNumber: "",
    modelo: "",
    marca: "",
    notaFiscal: "",
    disponibilidade: "",
  })

  const [regiaoSelecionada, setRegiaoSelecionada] = useState(
    role === "ADMINISTRADOR" ? "TODAS" : regiaoToken
  )

  const regioesDisponiveis = [
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

  const handleFilterChange = (e, campo) => {
    setFilters({ ...filters, [campo]: e.target.value })
  }

  // Função fetchDados fora do useEffect
  const fetchDados = async () => {
    if (!token) {
      setErro("Usuário não autenticado")
      setDados([])
      return
    }

    setLoading(true)
    setErro(null)
    console.log("Token enviado:", token)

    let rotaAPI = "http://localhost:8000/planilhas/ativos"

    if (role === "ADMINISTRADOR") {
      if (regiaoSelecionada && regiaoSelecionada !== "TODAS") {
        rotaAPI += `?regiao=${regiaoSelecionada}`
      }
    } else {
      rotaAPI += `?regiao=${regiaoToken}`
    }

    try {
      const response = await axios.get(rotaAPI, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const mapeados = response.data.map(item => ({
        tipo: item.tipo || "N/A",
        serialNumber: item.numero_serie || "N/A",
        modelo: item.modelo || "N/A",
        marca: item.marca || "N/A",
        notaFiscal: item.numero_ativo || "N/A",
        disponibilidade: item.status || "Em estoque",
        regiao: item.regiao || "N/A",
      }))

      setDados(mapeados)
    } catch (error) {
      
      if (error.response?.status === 401) {
        setErro("Token inválido ou expirado. Faça login novamente.")
        logout()
      } else {
        setErro("Erro ao carregar os dados da planilha.")
      }
      setDados([])
    } finally {
      setLoading(false)
    }
  }

  // useEffect chama fetchDados corretamente
  useEffect(() => {
    fetchDados()
  }, [regiaoSelecionada, role, regiaoToken, token])

  const dadosFiltrados = dados.filter(
    item =>
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
        item.disponibilidade === filters.disponibilidade)
  )

  const exportToExcel = () => {
    if (!dadosFiltrados.length) {
      alert("Nenhum dado para exportar!")
      return
    }

    const dadosParaExportar = dadosFiltrados.map(item => ({
      Tipo: item.tipo,
      SerialNumber: item.serialNumber,
      Modelo: item.modelo,
      Marca: item.marca,
      NotaFiscal: item.notaFiscal,
      Disponibilidade: item.disponibilidade,
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

        {role === "ADMINISTRADOR" && (
          <div className="seletor-regiao">
            <label htmlFor="regiao">Selecione a região:</label>
            <select
              id="regiao"
              value={regiaoSelecionada}
              onChange={e => setRegiaoSelecionada(e.target.value)}
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

        {loading && <div>Carregando dados...</div>}
        {erro && <div style={{ color: "red" }}>{erro}</div>}

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
                {dadosFiltrados.map((item, index) => (
                  <tr key={index}>
                    <td>{item.tipo}</td>
                    <td>{item.serialNumber}</td>
                    <td>{item.modelo}</td>
                    <td>{item.marca}</td>
                    <td>{item.notaFiscal}</td>
                    <td
                      style={{
                        color:
                          item.disponibilidade === "Em estoque"
                            ? "green"
                            : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {item.disponibilidade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button onClick={exportToExcel}>Baixar Excel</button>
      </div>
    </div>
  )
}

export default Planilha
