import React, { useContext } from "react";
import * as XLSX from "xlsx";
import "./Planilha.css";
import { TransferEntrada } from "../Transfer/TransferEntrada"; // ajuste conforme seu projeto
import { TransferSaida } from "../Transfer/TransferSaida"; // ✅ novo import

function Planilha() {
  const { data, setData } = useContext(TransferEntrada);
  const { itemSaiu } = useContext(TransferSaida); // ✅ novo contexto

  const dados = data.length > 0 ? data : [];

  const exportToExcel = () => {
    if (dados.length === 0) {
      alert("Nenhum dado para exportar!");
      return;
    }

    const dadosParaExportar = dados.map(item => ({
      SerialNumber: item.serialNumber || "N/A",
      Modelo: item.modelo || "N/A",
      Marca: item.marca || "N/A",
      ModeloMonitor: item.modeloMonitor || "N/A",
      SerialMonitor: item.serialMonitor || "N/A",
      Acessorios: item.accessories ? item.accessories.join(", ") : "N/A",
      Disponibilidade: item.disponibilidade || "N/A",
    }));

    const ws = XLSX.utils.json_to_sheet(dadosParaExportar);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Planilha");
    XLSX.writeFile(wb, "planilha.xlsx");
  };

  const realizarSaida = index => {
    const newData = [...data];
    newData[index].disponibilidade = "Indisponível";
    setData(newData);
  };

  // ✅ função para verificar se o item está em uso
  const verificarStatusUso = item => {
    return itemSaiu.some(saido =>
      saido.serialNumber === item.serialNumber &&
      saido.modelo === item.modelo &&
      saido.marca === item.marca
    );
  };

  return (
    <div className="planilha">
      <div className="inserir">
        <div className="titulo">PLANILHA</div>
        <div className="planilha-container">
          <table className="planilha-tabela">
            <thead>
              <tr>
                <th>Serial Number</th>
                <th>Modelo</th>
                <th>Marca</th>
                <th>Modelo Monitor</th>
                <th>Serial Monitor</th>
                <th>Acessórios</th>
                <th>Disponibilidade</th>
                <th>Status de Uso</th> {/* ✅ nova coluna */}
              </tr>
            </thead>
            <tbody>
              {dados.map((item, index) => {
                const emUso = verificarStatusUso(item);
                return (
                  <tr key={index}>
                    <td>{item.serialNumber || "N/A"}</td>
                    <td>{item.modelo || "N/A"}</td>
                    <td>{item.marca || "N/A"}</td>
                    <td>{item.modeloMonitor || "N/A"}</td>
                    <td>{item.serialMonitor || "N/A"}</td>
                    <td>
                      {item.accessories ? item.accessories.join(", ") : "N/A"}
                    </td>
                    <td>{item.disponibilidade || "N/A"}</td>
                    <td
                      style={{
                        color: emUso ? "red" : "green",
                        fontWeight: "bold"
                      }}
                    >
                      {emUso ? "EM USO" : "Disponível"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <button onClick={exportToExcel} className="btn-download">
          Baixar Excel
        </button>
      </div>
    </div>
  );
}

export default Planilha;
