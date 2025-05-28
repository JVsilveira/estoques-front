import React, { useContext } from "react"
import * as XLSX from "xlsx"
import "./Planilha.css"
import { TransferEntrada } from "../Transfer/TransferEntrada"
import { TransferSaida } from "../Transfer/TransferSaida"

function Planilha() {
  const { data, setData } = useContext(TransferEntrada)
  const { itemSaiu } = useContext(TransferSaida)

  const dados = data.length > 0 ? data : []

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

  const verificarStatusUso = item => {
    return itemSaiu.some(
      saido =>
        saido.serialNumber === item.serialNumber &&
        saido.modelo === item.modelo &&
        saido.marca === item.marca
    )
  }

  return (
    <div className="planilha">
      <div className="inserir">
        <div className="titulo">PLANILHA</div>
        <div className="planilha-container">
          <table className="planilha-tabela">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Serial Number</th>
                <th>Modelo</th>
                <th>Marca</th>
                <th>Nota Fiscal</th>
                <th>Disponibilidade</th>
                <th>Status de Uso</th>
              </tr>
            </thead>
            <tbody>
              {dados.map((item, index) => {
                const emUso = verificarStatusUso(item)
                return (
                  <tr key={index}>
                    <td>{item.tipo || "N/A"}</td>
                    <td>{item.serialNumber || "N/A"}</td>
                    <td>{item.modelo || "N/A"}</td>
                    <td>{item.marca || "N/A"}</td>
                    <td>{item.notaFiscal || "N/A"}</td>
                    <td>{item.disponibilidade || "N/A"}</td>
                    <td
                      style={{
                        color: emUso ? "red" : "green",
                        fontWeight: "bold",
                      }}
                    >
                      {emUso ? "EM USO" : "Disponível"}
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
