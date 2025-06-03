import React, { useState, useContext } from "react"
import "./Saida.css"
import { TransferEntrada } from "../Transfer/TransferEntrada"
import { TransferSaida } from "../Transfer/TransferSaida"
import api from "../../api/api"
import { extractPdfText } from "../Utility/pdfUtils"

function Saída() {
  const [error, setError] = useState("")
  const [notebookModel, setNotebookModel] = useState("")
  const [notebookBrand, setNotebookBrand] = useState("")
  const [notebookTipo, setNotebookTipo] = useState("")
  const [accessories, setAccessories] = useState([])
  const [loading, setLoading] = useState(false)
  const [serialNumber, setSerialNumber] = useState("")
  const [assetNumber, setAssetNumber] = useState("")
  const [nfNumber, setNfNumber] = useState("")
  const [modelMonitor, setModelMonitor] = useState("")
  const [serialMonitor, setSerialMonitor] = useState("")
  const { setData } = useContext(TransferEntrada)
  const { itemSaiu, marcarComoSaiu } = useContext(TransferSaida)

  const enviarParaPlanilha = async () => {
    const accessoriesCounted = accessories.map(item => ({
      name: item,
      quantidade: 1,
    }))

    // Adiciona notebook como item
    accessoriesCounted.push({
      name: notebookModel,
      quantidade: 1,
    })

    // Se houver monitor, adiciona também
    if (modelMonitor && serialMonitor) {
      accessoriesCounted.push({
        name: modelMonitor,
        quantidade: 1,
      })
    }

    const itemSaidaNotebook = {
      serialNumber,
      modelo: notebookModel,
      marca: notebookBrand,
      tipo: notebookTipo,
      accessoriesCounted,
      disponibilidade: "Em Uso",
      assetNumber,
      nfNumber,
    }

    // Atualiza o monitor separadamente, se houver
    if (modelMonitor && serialMonitor) {
      const itemSaidaMonitor = {
        serialNumber: serialMonitor,
        modelo: modelMonitor,
        tipo: "Monitor",
        disponibilidade: "Em Uso",
        nfNumber,
      }

      try {
        const responseMonitor = await api.get(`/planilha/item/${serialMonitor}`)
        if (responseMonitor.data && responseMonitor.data.exists) {
          await api.put(`/planilha/item/${serialMonitor}`, itemSaidaMonitor)
          alert("Monitor atualizado como 'Em Uso' na planilha.")
        } else {
          alert("Monitor não encontrado na planilha!")
        }
      } catch (err) {
        console.error("Erro ao comunicar com API (Monitor):", err)
        alert("Erro ao comunicar com a API para o monitor.")
      }
    } else {
      console.log("Nenhum monitor detectado para atualização.")
    }

    // Atualiza o notebook normalmente
    try {
      console.log("Enviando item de saída:", itemSaidaNotebook)
      const response = await api.get(`/planilha/item/${serialNumber}`)
      if (response.data && response.data.exists) {
        await api.put(`/planilha/item/${serialNumber}`, itemSaidaNotebook)
        alert("Ativo atualizado como 'Em Uso' na planilha.")
      } else {
        alert("Ativo não encontrado na planilha!")
      }
    } catch (err) {
      console.error("Erro ao comunicar com API (Ativo):", err)
      alert("Erro ao comunicar com a API para o ativo.")
    }
  }

  const captureHeadset = (text, peripheralsList) => {
    // Ajusta a regex para pegar o Headset seguido do status Sim/Não
    const headsetRegex = /Headset\s*\(.*?\)\s*(Sim|Não)/i
    const match = text.match(headsetRegex)
    if (match) {
      console.log("Headset encontrado com status:", match[1])
      if (match[1] === "Sim") {
        peripheralsList.push({
          name: "Headset",
          status: match[1],
        })
      }
    } else {
      console.log("Headset não encontrado")
    }
  }

  const captureDockStation = (text, peripheralsList) => {
    // Ajusta a regex para pegar o Dock Station seguido do status Sim/Não
    const dockStationRegex = /Dock Station\s*\(.*?\)\s*(Sim|Não)/i
    const match = text.match(dockStationRegex)
    if (match) {
      console.log("Dock Station encontrado com status:", match[1])
      if (match[1] === "Sim") {
        peripheralsList.push({
          name: "Dock Station",
          status: match[1],
        })
      }
    } else {
      console.log("Dock Station não encontrado")
    }
  }

  const monitorMatch = (text, peripheralsList) => {
    // Ajusta a regex para capturar o modelo e número de série do monitor com o formato fornecido
    const monitorRegex =
      /Monitor\s*\(Marca\/Modelo\s*:\s*([^\)]+?)\s*Nro\s*Série\s*[:\-\s]*([A-Za-z0-9\-]+)\s*\)\s*(Sim|Não)/i
    const match = text.match(monitorRegex)

    if (match && match[3] === "Sim") {
      setModelMonitor(match[1])
      setSerialMonitor(match[2])
      console.log("Modelo do Monitor:", match[1])
      console.log("Número de Série do Monitor:", match[2])

      // Adiciona o monitor na lista de periféricos com o status "Sim"
      peripheralsList.push({
        name: "Monitor",
        status: "Sim",
        additionalInfo: `Modelo: ${match[1]}, Nº Série: ${match[2]}`,
      })
    } else {
      console.log('Monitor não encontrado ou status não é "Sim"')
    }
  }

  const captureCaboSeguranca = (text, peripheralsList) => {
    // Ajusta a regex para pegar Cabo de Segurança seguido de "Sim" ou "Não"
    const caboSegurancaRegex = /Cabo de Segurança(.*?)\s*(Sim|Não)/i
    const match = text.match(caboSegurancaRegex)

    if (match) {
      console.log("Cabo de Segurança encontrado com status:", match[2]) // match[2] contém o status "Sim" ou "Não"
      // Só adiciona o item à lista se o status for "Sim"
      if (match[2] === "Sim") {
        peripheralsList.push({
          name: "Cabo de Segurança",
          status: match[2],
        })
      }
    } else {
      console.log("Cabo de Segurança não encontrado")
    }
  }
  // Função para capturar os outros acessórios
  const captureAccessory = (item, text, peripheralsList) => {
    // Escapa caracteres especiais no nome do item
    const escapedItem = item.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") // Escapa caracteres especiais
    // Regex ajustada para capturar o item e seu status (Sim/Não)
    const regex = new RegExp(
      `(${escapedItem})\\s*(\\(Marca/Modelo\\s*:\\s*[^)]+?\\s*Nro\\s*Série\\s*:\\s*[^)]+?\\))?\\s*(Sim|Não)`,
      "i"
    )
    const match = text.match(regex)

    if (match) {
      const name = match[1].trim() // Nome do item (ex: Headset)
      const additionalInfo = match[2] ? match[2].trim() : "" // Informações adicionais, caso existam
      const status = match[3].trim() // Status (ex: "Sim" ou "Não")

      console.log(
        `Item encontrado: ${name} ${
          additionalInfo ? `- Info adicional: ${additionalInfo}` : ""
        } - Status: ${status}`
      )

      // Adiciona na lista apenas se o status for "Sim"
      if (status === "Sim") {
        peripheralsList.push({ name, additionalInfo, status })
      }
    } else {
      console.log(`Não encontrado: ${item}`)
    }
  }

  const handleFileChange = async event => {
    const file = event.target.files[0]
    if (file) {
      // Limpar dados antes de processar o novo PDF
      setError("")
      setNotebookTipo("")
      setNotebookModel("")
      setNotebookBrand("")
      setAccessories([]) // Limpar acessórios
      setSerialNumber("")
      setAssetNumber("")
      setNfNumber("")
      setModelMonitor("")
      setSerialMonitor("")
      setLoading(true)

      try {
        const text = await extractPdfText(file)
        console.log("Texto extraído do PDF:", text)

        // Extração do Modelo e Marca do Notebook
        const notebookTipoMatch = text.match(/um[^\w]+(\S[\w\s-]+)/i)
        const notebookModelMatch = text.match(/modelo[^\w]+(\S[\w\s-]+)/i)
        const notebookBrandMatch = text.match(/marca[^\w]+(\S[\w\s-]+)/i)
        const nfNumberMatch = text.match(/NF\s*nº?\s*(\d+)/i)

        if (notebookTipoMatch) {
          setNotebookTipo(notebookTipoMatch[1])
        }

        if (nfNumberMatch) {
          setNfNumber(nfNumberMatch[1])
        }

        if (notebookModelMatch) {
          setNotebookModel(notebookModelMatch[1])
        }

        if (notebookBrandMatch) {
          setNotebookBrand(notebookBrandMatch[1])
        }

        // Captura do Número do Ativo
        const assetNumberMatch = text.match(/NÚMERO DO ATIVO\s*(\d+)/i)
        if (assetNumberMatch) {
          setAssetNumber(assetNumberMatch[1].trim()) // Remover espaços extras
        }

        // Captura do Número de Série (Serial Number) e remover espaços
        const serialNumberMatch = text.match(
          /nº de série\s*[:\-\s]*([A-Za-z0-9\-]+\s*[A-Za-z0-9\-]*)+/i
        )
        if (serialNumberMatch) {
          // Remover os espaços do número de série
          const serialNumber = serialNumberMatch[1].replace(/\s+/g, "")
          setSerialNumber(serialNumber) // Exibir sem espaços
        }

        // Extração de Acessórios
        const peripheralsSectionMatch = text.match(
          /ACESSÓRIOS[\s\S]+?Docusign Envelope ID:/i
        )
        console.log("Seção de acessórios:", peripheralsSectionMatch)

        if (peripheralsSectionMatch) {
          const peripheralsText = peripheralsSectionMatch[0]
          const peripheralsList = []

          // Chama as funções para capturar os acessórios com informações adicionais
          captureHeadset(peripheralsText, peripheralsList)
          captureDockStation(peripheralsText, peripheralsList)
          captureCaboSeguranca(peripheralsText, peripheralsList)
          monitorMatch(peripheralsText, peripheralsList)

          // Lista dos outros acessórios
          const accessoryList = [
            "Mouse",
            "Teclado",
            "Cabo RCA",
            "Cabo paralelo para unidade externa",
            "Maleta/Mochila para Notebook",
            "Suporte Ergonômico",
            "Bateria Extra",
            "Carregador Extra",
            "Adaptador HDMI",
            "Lacre de Segurança",
            "Kit boas - vindas",
            "Webcam",
            "Hub USB",
            "Cabo de força do monitor",
          ].map(item => item.trim())

          // Captura os outros acessórios
          accessoryList.forEach(item => {
            captureAccessory(item, peripheralsText, peripheralsList)
          })

          // Filtra os acessórios com status "Sim"
          const filteredPeripherals = peripheralsList.filter(
            peripheral => peripheral.status === "Sim"
          )
          console.log("Acessórios filtrados:", filteredPeripherals)
          setAccessories(filteredPeripherals.map(peripheral => peripheral.name))
        }
      } catch (err) {
        setError("Falha ao ler PDF.")
        console.error("Error reading PDF:", err)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="saida">
      <div className="inserir">
        <div className="titulo">SAÍDA DE ATIVOS</div>
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
            <p>Tipo: {notebookTipo}</p>
            <p>Marca: {notebookBrand}</p>
            <p>Modelo: {notebookModel}</p>
            <p>Serial: {serialNumber}</p>
            <p>Patrimônio: {assetNumber}</p>
            <h3>NF: </h3>
            <p>{nfNumber}</p>
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
        <button className="btn-download" onClick={enviarParaPlanilha}>
          Enviar para Planilha
        </button>
      </div>
    </div>
  )
}

export default Saída
