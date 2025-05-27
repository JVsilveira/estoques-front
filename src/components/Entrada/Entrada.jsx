import React, { useState } from "react"
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist"
import "./Entrada.css"
import { useContext } from "react"
import { TransferEntrada } from "../Transfer/TransferEntrada"

// Configure o caminho do worker global
GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js"

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
      // Limpar dados antes de processar o novo PDF
      setError("")
      setNotebookModel("")
      setNotebookBrand("")
      setSerialNumber("")
      setModelMonitor("")
      setSerialMonitor("")
      setLoading(true)
      setAccessories([])

      const fileReader = new FileReader()
      fileReader.onload = async function () {
        try {
          const typedArray = new Uint8Array(this.result)
          const pdf = await getDocument(typedArray).promise
          let text = ""
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i)
            const textContent = await page.getTextContent()
            text += textContent.items.map(item => item.str).join(" ")
          }

          // Limpeza e normalização do texto
          text = text.replace(/\s+/g, " ").trim()
          text = text.replace(/\n/g, " ")

          console.log("Texto extraído do PDF:", text) // Log para ver todo o texto extraído
          setError("")

          // Captura o modelo, marca e número de série do notebook
          const notebookModelMatch = text.match(
            /modelo[^\w]+([A-Za-z0-9\s\-]+)/i
          )
          const notebookBrandMatch = text.match(
            /marca[^\w]+([A-Za-z0-9\s\-]+)/i
          )
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
            const cleanedSerialNumber = serialNumberMatch[1]?.replace(
              /\s+/g,
              ""
            )
            setSerialNumber(cleanedSerialNumber || "") // Ajustar para capturar corretamente
          }

          const monitorSectionMatch = (text, peripheralsList) => {
            // Captura a seção relacionada ao monitor
            const match = text.match(
              /Monitor.*?(Sim\s*Sim|Não\s*Não|Sim\s*Não|Não\s*Sim)/i
            )

            if (match) {
              console.log("Texto extraído da seção do Monitor:", match[0])
              const sectionText = match[0]

              const secondTermMatch = sectionText.match(
                /(Sim|Não)\s*(Sim|Não)$/i
              )

              if (secondTermMatch && secondTermMatch[2] === "Sim") {
                const modelMatch = sectionText.match(
                  /Marca\/Modelo:\s*([^\)]+?\s*\-\s*\d+)/i
                )
                const serialMatch = sectionText.match(
                  /Série\s*[:\-\s]*([A-Za-z0-9\-]+)/i
                )

                // Adiciona o modelo e o número de série do monitor ao estado
                if (modelMatch) {
                  setModelMonitor(modelMatch[1].trim())
                }

                if (serialMatch) {
                  setSerialMonitor(serialMatch[1].trim())
                }

                // Adiciona o monitor na lista de periféricos
                peripheralsList.push({
                  item: "Monitor", // Nome do item
                  status: "Sim Sim", // Status configurado para 'Sim Sim' (pode ser alterado conforme necessário)
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
            const peripheralsText = peripheralsSectionMatch[0] // Definindo a variável peripheralsText

            console.log("Texto dos periféricos:", peripheralsText) // Log para ver os periféricos

            // Função para capturar acessórios específicos como Headset, Dock Station e Cabo de Segurança
            const captureSpecificAccessory = (item, text) => {
              const escapedItem = item.replace(
                /[-[\]{}()*+?.,\\^$|#\s]/g,
                "\\$&"
              ) // Escapa caracteres especiais

              // Regex para capturar o item com informações entre parênteses e status
              const regex = new RegExp(
                `(${escapedItem})\\s*\\(([^)]+)\\)\\s*(Sim\\s*Sim|Não\\s*Sim)`,
                "i"
              )
              const match = text.match(regex)

              if (match) {
                const name = match[1].trim() // Nome do item (ex: Headset)
                const additionalInfo = match[2].trim() // Informações adicionais (ex: "Marca/Modelo: C3220 - 2HKHM2")
                const status = match[3].trim() // Status (ex: "Sim Sim" ou "Não Sim")

                console.log(
                  `Item encontrado: ${name} - Info adicional: ${additionalInfo} - Status: ${status}`
                )

                // Filtra os itens que possuem "Sim Sim" ou "Não Sim"
                if (status === "Sim Sim" || status === "Não Sim") {
                  peripheralsList.push({ name, additionalInfo, status })
                }
              } else {
                console.log(`Não encontrado: ${item}`) // Log para itens que não foram encontrados
              }
            }

            const captureAccessory = (item, text) => {
              const escapedItem = item.replace(
                /[-[\]{}()*+?.,\\^$|#\s]/g,
                "\\$&"
              ) // Escapa caracteres especiais

              // A regex foi ajustada para capturar o padrão "Sim Sim" ou "Não Sim"
              const regex = new RegExp(
                `(${escapedItem})\\s*(Sim\\s*Sim|Não\\s*Sim)`,
                "i"
              )
              const match = text.match(regex)

              if (match) {
                const status = match[2] ? match[2].trim() : "" // Captura o status
                console.log(`Item encontrado: ${item} - Status: ${status}`) // Log para ver o item e status
                // Filtra os itens que possuem "Sim Sim" ou "Não Sim"
                if (status === "Sim Sim" || status === "Não Sim") {
                  peripheralsList.push({ item, status })
                }
              } else {
                console.log(`Não encontrado: ${item}`) // Log para itens que não foram encontrados
              }
            }

            // Lista dos acessórios com limpeza de espaços extras
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
              "Dock Station", // Vai usar a função para Dock Station
              "Lacre de Segurança",
              "Headset",
              "Kit boas-vindas",
              "Webcam",
              "Hub USB",
              "Cabo de força do monitor",
            ].map(item => item.trim()) // Remover espaços extras ao redor dos itens

            console.log("Lista de acessórios:", accessoryList) // Log para verificar a lista

            const peripheralsList = []

            // Captura todos os acessórios
            accessoryList.forEach(item => {
              if (
                item === "Headset" ||
                item === "Dock Station" ||
                item === "Cabo de Segurança Código chave - )"
              ) {
                // Para esses itens específicos, chamamos a função especial
                captureSpecificAccessory(item, peripheralsText)
              } else {
                // Para os demais acessórios, usamos a função normal
                captureAccessory(item, peripheralsText)
              }
            })

            monitorSectionMatch(text, peripheralsList)
            // Agora, vamos filtrar os acessórios com o padrão Sim Sim ou Não Sim
            const filteredPeripherals = peripheralsList.filter(
              peripheral =>
                peripheral.status === "Sim Sim" ||
                peripheral.status === "Não Sim"
            )

            console.log("Acessórios filtrados:", filteredPeripherals) // Log para ver os acessórios filtrados

            // Exibir os acessórios no estado
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
      fileReader.readAsArrayBuffer(file)
    }
  }
  const handleEnviarParaPlanilha = () => {
    const newData = {
      serialNumber: serialNumber || "N/A",
      modelo: notebookModel || "N/A",
      marca: notebookBrand || "N/A",
      modeloMonitor: modelMonitor || "N/A",
      serialMonitor: serialMonitor || "N/A",
      accessories,
      disponibilidade: "Disponível", // ✅ Aqui
    }
    addData(newData)
    alert("Dados enviados para a planilha com sucesso!")
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
        <button onClick={handleEnviarParaPlanilha}>Enviar para Planilha</button>
      </div>
    </div>
  )
}

export default Entrada
