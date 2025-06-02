import React, { useState } from "react"
import "./Entrada.css"
import { useContext } from "react"
import { TransferEntrada } from "../Transfer/TransferEntrada"
import axios from "axios"
import { extractPdfText } from "../Utility/pdfUtils"

function Entrada() {
  const [error, setError] = useState("")
  const [notebookModel, setNotebookModel] = useState("")
  const [notebookBrand, setNotebookBrand] = useState("")
  const [modelMonitor, setModelMonitor] = useState("")
  const [serialMonitor, setSerialMonitor] = useState("")
  const [serialNumber, setSerialNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [accessories, setAccessories] = useState([])
  const { addData } = useContext(TransferEntrada)

  const handleFileChange = async event => {
    const file = event.target.files[0]
    if (file) {
      setError("")
      setNotebookModel("")
      setNotebookBrand("")
      setSerialNumber("")
      setModelMonitor("")
      setSerialMonitor("")
      setLoading(true)
      setAccessories([])

      try {
        const text = await extractPdfText(file)
        console.log("Texto extraído do PDF:", text)

        const notebookModelMatch = text.match(/modelo[^\w]+([A-Za-z0-9\s\-]+)/i)
        const notebookBrandMatch = text.match(/marca[^\w]+([A-Za-z0-9\s\-]+)/i)
        const serialNumberMatch = text.match(
          /nº de série\s*[:\-\s]*([A-Za-z0-9]+)/i
        )

        if (notebookModelMatch) {
          setNotebookModel(notebookModelMatch[1])
        }

        if (notebookBrandMatch) {
          setNotebookBrand(notebookBrandMatch[1])
        }

        if (serialNumberMatch) {
          const cleanedSerialNumber = serialNumberMatch[1]?.replace(/\s+/g, "")
          setSerialNumber(cleanedSerialNumber || "")
        }

        // Função para extrair dados do monitor
        const monitorSectionMatch = (text, peripheralsList) => {
          const match = text.match(
            /Monitor.*?(Sim\s*Sim|Não\s*Não|Sim\s*Não|Não\s*Sim)/i
          )
          if (match) {
            console.log("Texto extraído da seção do Monitor:", match[0])
            const sectionText = match[0]
            const secondTermMatch = sectionText.match(/(Sim|Não)\s*(Sim|Não)$/i)
            if (secondTermMatch && secondTermMatch[2] === "Sim") {
              const modelMatch = sectionText.match(
                /Marca\/Modelo:\s*([^\)]+?)\s*Nro Série\s*:/i
              )
              const serialMatch = sectionText.match(
                /Série\s*[:\-\s]*([A-Za-z0-9\-]+)/i
              )
              if (modelMatch) setModelMonitor(modelMatch[1].trim())
              if (serialMatch) setSerialMonitor(serialMatch[1].trim())
              peripheralsList.push({
                item: "Monitor",
                status: "Sim Sim",
                model: modelMatch ? modelMatch[1].trim() : "",
                serial: serialMatch ? serialMatch[1].trim() : "",
              })
              console.log("Monitor adicionado à lista de periféricos:", {
                model: modelMatch ? modelMatch[1].trim() : "",
                serial: serialMatch ? serialMatch[1].trim() : "",
              })
            } else {
              console.log(
                "Monitor não foi devolvido (segundo termo não é 'Sim')."
              )
            }
          }
        }

        const peripheralsSectionMatch = text.match(
          /ACESSÓRIOS[\s\S]+?Docusign Envelope ID:/i
        )
        if (peripheralsSectionMatch) {
          const peripheralsText = peripheralsSectionMatch[0]
          console.log("Texto dos periféricos:", peripheralsText)

          const captureSpecificAccessory = (item, text) => {
            const escapedItem = item.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
            const regex = new RegExp(
              `(${escapedItem})\\s*\\(([^)]+)\\)\\s*(Sim\\s*Sim|Não\\s*Sim)`,
              "i"
            )
            const match = text.match(regex)
            if (match) {
              const name = match[1].trim()
              const additionalInfo = match[2].trim()
              const status = match[3].trim()
              console.log(
                `Item encontrado: ${name} - Info adicional: ${additionalInfo} - Status: ${status}`
              )
              if (status === "Sim Sim" || status === "Não Sim") {
                peripheralsList.push({ name, additionalInfo, status })
              }
            } else {
              console.log(`Não encontrado: ${item}`)
            }
          }

          const captureAccessory = (item, text) => {
            const escapedItem = item.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
            const regex = new RegExp(
              `(${escapedItem})\\s*(Sim\\s*Sim|Não\\s*Sim)`,
              "i"
            )
            const match = text.match(regex)
            if (match) {
              const status = match[2] ? match[2].trim() : ""
              console.log(`Item encontrado: ${item} - Status: ${status}`)
              if (status === "Sim Sim" || status === "Não Sim") {
                peripheralsList.push({ item, status })
              }
            } else {
              console.log(`Não encontrado: ${item}`)
            }
          }

          const accessoryList = [
            "Mouse",
            "Teclado",
            "Monitor",
            "Cabo RCA",
            "Cabo paralelo para unidade externa",
            "Maleta/Mochila para Notebook",
            "Suporte Ergonômico",
            "Cabo de Segurança Código chave - )",
            "Bateria Extra",
            "Carregador Extra",
            "Adaptador HDMI",
            "Dock Station",
            "Lacre de Segurança",
            "Headset",
            "Kit boas-vindas",
            "Webcam",
            "Hub USB",
            "Cabo de força do monitor",
          ].map(item => item.trim())

          console.log("Lista de acessórios:", accessoryList)

          const peripheralsList = []

          accessoryList.forEach(item => {
            if (
              item === "Headset" ||
              item === "Dock Station" ||
              item === "Cabo de Segurança Código chave - )"
            ) {
              captureSpecificAccessory(item, peripheralsText)
            } else {
              captureAccessory(item, peripheralsText)
            }
          })

          monitorSectionMatch(text, peripheralsList)

          const filteredPeripherals = peripheralsList.filter(
            peripheral =>
              peripheral.status === "Sim Sim" || peripheral.status === "Não Sim"
          )

          console.log("Acessórios filtrados:", filteredPeripherals)

          setAccessories(
            filteredPeripherals.map(
              peripheral => peripheral.name || peripheral.item
            )
          )
        }
      } catch (err) {
        setError("Falha ao ler PDF.")
        console.error("Error reading PDF:", err)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleEnviarParaServidor = async () => {
    const token = localStorage.getItem("token")
    const linhasParaPlanilha = []

    // Linha do Notebook
    linhasParaPlanilha.push({
      tipo: "Notebook/Desktop",
      serialNumber: serialNumber || "N/A",
      modelo: notebookModel || "N/A",
      marca: notebookBrand || "N/A",
      disponibilidade: "Em estoque",
    })

    // Linha do Monitor, se houver
    if (modelMonitor || serialMonitor) {
      linhasParaPlanilha.push({
        tipo: "Monitor",
        serialNumber: serialMonitor || "N/A",
        modelo: modelMonitor || "N/A",
        marca: "N/A",
        disponibilidade: "Em estoque",
      })
    }

    try {
      for (const linha of linhasParaPlanilha) {
        console.log("Enviando para o servidor:", linha)
        await axios.post("/api/entrada", linha, {
          headers: { Authorization: `Bearer ${token}` },
        })
      }
      alert("Dados enviados ao servidor com sucesso!")
    } catch (error) {
      alert("Erro ao enviar dados para o servidor.")
      console.error("Erro ao enviar:", error)
    }
  }

  return (
    <div className="entrada">
      <div className="inserir">
        <div className="titulo">ENTRADA DE ATIVOS</div>
        <div className="arquivo">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
          />
          {loading && <div>Carregando...</div>}
          {error && <div className="error">{error}</div>}
        </div>
        <div className="ativos">
          <div className="notebook">
            <h3>Modelo do Ativo:</h3>
            <p>Marca: {notebookBrand}</p>
            <p>Modelo: {notebookModel}</p>
            <p>Serial: {serialNumber}</p>
          </div>

          <div className="monitor">
            <h3>Monitor:</h3>
            <p>Modelo: {modelMonitor}</p>
            <p>Número de Série: {serialMonitor}</p>
          </div>

          <div className="acessorios">
            <h3>Acessórios:</h3>
            <ul>
              {accessories.map((accessory, index) => (
                <li key={index}>{accessory}</li>
              ))}
            </ul>
          </div>
        </div>
        <button className="btn-download" onClick={handleEnviarParaServidor}>
          Enviar para Planilha
        </button>
      </div>
    </div>
  )
}

export default Entrada
