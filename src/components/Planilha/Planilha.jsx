import React, { useContext, useState } from "react"
import * as XLSX from "xlsx"
import "./Planilha.css"
import { TransferEntrada } from "../Transfer/TransferEntrada"
import { TransferSaida } from "../Transfer/TransferSaida"

function Planilha() {
  const { data } = useContext(TransferEntrada)
  const { itemSaiu } = useContext(TransferSaida)

  const [filters, setFilters] = useState({
    tipo: "",
    serialNumber: "",
    modelo: "",
    marca: "",
    notaFiscal: "",
    disponibilidade: "",
  })

  const dados = data.length > 0 ? data : []

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
    if (dados.length === 0) {
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
        <div className="planilha-container">
          <table className="planilha-tabela">
            <thead>
              <tr>
                <th>
                  Tipo
                  <br />
                  <input
                    type="text"
                    value={filters.tipo}
                    onChange={e => handleFilterChange(e, "tipo")}
                    placeholder="Filtrar"
                  />
                </th>
                <th>
                  Serial Number
                  <br />
                  <input
                    type="text"
                    value={filters.serialNumber}
                    onChange={e => handleFilterChange(e, "serialNumber")}
                    placeholder="Filtrar"
                  />
                </th>
                <th>
                  Modelo
                  <br />
                  <input
                    type="text"
                    value={filters.modelo}
                    onChange={e => handleFilterChange(e, "modelo")}
                    placeholder="Filtrar"
                  />
                </th>
                <th>
                  Marca
                  <br />
                  <input
                    type="text"
                    value={filters.marca}
                    onChange={e => handleFilterChange(e, "marca")}
                    placeholder="Filtrar"
                  />
                </th>
                <th>
                  Nota Fiscal
                  <br />
                  <input
                    type="text"
                    value={filters.notaFiscal}
                    onChange={e => handleFilterChange(e, "notaFiscal")}
                    placeholder="Filtrar"
                  />
                </th>
                <th>
                  Disponibilidade
                  <br />
                  <select
                    value={filters.disponibilidade}
                    onChange={e => handleFilterChange(e, "disponibilidade")}
                  >
                    <option value="">Todos</option>
                    <option value="Em estoque">Em estoque</option>
                    <option value="Em uso">Em uso</option>
                  </select>
                </th>
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
        <button onClick={exportToExcel} className="btn-download">
          Baixar Excel
        </button>
      </div>
    </div>
  )
}

export default Planilha
