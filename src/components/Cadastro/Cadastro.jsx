import React, { useState } from "react"
import "./Cadastro.css"
import api from "../../api/api"

function Cadastro() {
  const [modeloAtivo, setModeloAtivo] = useState("")
  const [marcaAtivo, setMarcaAtivo] = useState("")
  const [skuAtivo, setSkuAtivo] = useState("")
  const [notaFiscalAtivo, setNotaFiscalAtivo] = useState("")
  const [quantidadeAtivo, setQuantidadeAtivo] = useState(1)
  const [ativosList, setAtivosList] = useState([])
  const [loadingAtivo, setLoadingAtivo] = useState(false)
  const [tipoAtivo, setTipoAtivo] = useState("")

  const [modeloPeriferico, setModeloPeriferico] = useState("")
  const [marcaPeriferico, setMarcaPeriferico] = useState("")
  const [skuPeriferico, setSkuPeriferico] = useState("")
  const [notaFiscalPeriferico, setNotaFiscalPeriferico] = useState("")
  const [quantidadePeriferico, setQuantidadePeriferico] = useState(1)
  const [perifericosList, setPerifericosList] = useState([])
  const [loadingPeriferico, setLoadingPeriferico] = useState(false)
  const [tipoPeriferico, setTipoPeriferico] = useState("")

  // Funções para ATIVOS
  const handleQuantidadeAtivoChange = e =>
    setQuantidadeAtivo(Number(e.target.value))

  const handleQuantidadeAtivoBlur = () => {
    let qtd = Number(quantidadeAtivo)
    if (qtd < 1 || isNaN(qtd)) qtd = 1
    setQuantidadeAtivo(qtd)
    setAtivosList(Array.from({ length: qtd }, () => ({ serialNumber: "" })))
  }

  const handleSerialNumberAtivoChange = (index, value) => {
    const newAtivos = [...ativosList]
    newAtivos[index] = { serialNumber: value }
    setAtivosList(newAtivos)
  }

  const handleSubmitAtivo = async e => {
    e.preventDefault()
    if (ativosList.some(ativo => !ativo.serialNumber)) {
      alert("Preencha todos os números de série antes de cadastrar.")
      return
    }

    const dadosProduto = ativosList.map(ativo => ({
      quantidade: quantidadeAtivo,
      tipo: tipoAtivo,
      ativo: tipoAtivo,
      modelo: modeloAtivo,
      marca: marcaAtivo,
      sku: skuAtivo,
      notaFiscal: notaFiscalAtivo,
      serialNumber: ativo.serialNumber,
      disponibilidade: "Em estoque",
    }))

    setLoadingAtivo(true)
    try {
      for (const ativo of dadosProduto) {
        console.log("Cadastrando ativo:", ativo)
        await api.post("/planilha/ativos", ativo)
      }
      alert("Ativos cadastrados com sucesso!")
      setTipoAtivo("")
      setModeloAtivo("")
      setMarcaAtivo("")
      setSkuAtivo("")
      setNotaFiscalAtivo("")
      setQuantidadeAtivo(1)
      setAtivosList([])
    } catch (error) {
      console.error("Erro ao cadastrar ativos:", error)
      alert("Erro ao cadastrar ativos. Tente novamente.")
    } finally {
      setLoadingAtivo(false)
    }
  }

  // Funções para PERIFÉRICOS
  const handleQuantidadePerifericoChange = e =>
    setQuantidadePeriferico(Number(e.target.value))

  const handleQuantidadePerifericoBlur = () => {
    let qtd = Number(quantidadePeriferico)
    if (qtd < 1 || isNaN(qtd)) qtd = 1
    setQuantidadePeriferico(qtd)
    setPerifericosList(
      Array.from({ length: qtd }, () => ({ serialNumber: "" }))
    )
  }

  const handleSerialNumberPerifericoChange = (index, value) => {
    const newPerifericos = [...perifericosList]
    newPerifericos[index] = { serialNumber: value }
    setPerifericosList(newPerifericos)
  }

  const handleSubmitPeriferico = async e => {
    e.preventDefault()
    if (perifericosList.some(p => !p.serialNumber)) {
      alert("Preencha todos os números de série antes de cadastrar.")
      return
    }

    const dadosPeriferico = perifericosList.map(p => ({
      quantidade: quantidadePeriferico,
      tipo: tipoPeriferico,
      modelo: modeloPeriferico,
      marca: marcaPeriferico,
      sku: skuPeriferico,
      notaFiscal: notaFiscalPeriferico,
      serialNumber: p.serialNumber,
      disponibilidade: "Em estoque",
    }))

    setLoadingPeriferico(true)
    try {
      for (const periferico of dadosPeriferico) {
        console.log("Cadastrando periférico:", periferico)
        await api.post("/planilha/perifericos", periferico)
      }
      alert("Periféricos cadastrados com sucesso!")
      setTipoPeriferico("")
      setModeloPeriferico("")
      setMarcaPeriferico("")
      setSkuPeriferico("")
      setNotaFiscalPeriferico("")
      setQuantidadePeriferico(1)
      setPerifericosList([])
    } catch (error) {
      console.error("Erro ao cadastrar periféricos:", error)
      alert("Erro ao cadastrar periféricos. Tente novamente.")
    } finally {
      setLoadingPeriferico(false)
    }
  }

  return (
    <div className="cadastro">
      <div className="inserirCadastro">
        <div className="titulo">CADASTRO DE ATIVOS</div>
        <div className="formulario">
          <form onSubmit={handleSubmitAtivo}>
            <div className="triagem">
              <div>
                <label>Quantidade:</label>
                <br />
                <input
                  type="number"
                  value={quantidadeAtivo}
                  onChange={handleQuantidadeAtivoChange}
                  onBlur={handleQuantidadeAtivoBlur}
                  min="1"
                  required
                />
              </div>
              <div>
                <label>Tipo:</label>
                <br />
                <select
                  value={tipoAtivo}
                  onChange={e => setTipoAtivo(e.target.value)}
                  required
                >
                  <option value="">Selecione o tipo</option>
                  <option value="notebook">Notebook</option>
                  <option value="desktop">Desktop</option>
                  <option value="minidesktop">Minidesktop</option>
                  <option value="monitor">Monitor</option>
                </select>
              </div>
              <div>
                <label>Modelo:</label>
                <br />
                <input
                  type="text"
                  value={modeloAtivo}
                  onChange={e => setModeloAtivo(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>Marca:</label>
                <br />
                <input
                  type="text"
                  value={marcaAtivo}
                  onChange={e => setMarcaAtivo(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>SKU:</label>
                <br />
                <input
                  type="text"
                  value={skuAtivo}
                  onChange={e => setSkuAtivo(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>Nota Fiscal:</label>
                <br />
                <input
                  type="text"
                  value={notaFiscalAtivo}
                  onChange={e => setNotaFiscalAtivo(e.target.value)}
                  required
                />
              </div>
            </div>
            <br />
            <div className="planilha-container-cadastro">
              <table className="planilha-tabela">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Modelo</th>
                    <th>Marca</th>
                    <th>SKU</th>
                    <th>Nota Fiscal</th>
                    <th>Número de Série</th>
                  </tr>
                </thead>
                <tbody>
                  {ativosList.map((ativo, index) => (
                    <tr key={index}>
                      <td>{tipoAtivo}</td>
                      <td>{modeloAtivo}</td>
                      <td>{marcaAtivo}</td>
                      <td>{skuAtivo}</td>
                      <td>{notaFiscalAtivo}</td>
                      <td>
                        <input
                          type="text"
                          value={ativo.serialNumber}
                          onChange={e =>
                            handleSerialNumberAtivoChange(index, e.target.value)
                          }
                          required
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="botao">
              <button
                className="btn-download"
                type="submit"
                disabled={loadingAtivo}
              >
                {loadingAtivo ? "Cadastrando..." : "Cadastrar"}
              </button>
            </div>
          </form>
        </div>
        <div />
        <div />
        <div />
        <div /> <div />
      </div>

      <div className="inserirCadastro">
        <div className="titulo">CADASTRO DE PERIFÉRICOS</div>
        <div className="formulario">
          <form onSubmit={handleSubmitPeriferico}>
            <div className="triagem">
              <div>
                <label>Quantidade:</label>
                <br />
                <input
                  type="number"
                  value={quantidadePeriferico}
                  onChange={handleQuantidadePerifericoChange}
                  onBlur={handleQuantidadePerifericoBlur}
                  min="1"
                  required
                />
              </div>
              <div>
                <label>Tipo:</label>
                <br />
                <select
                  value={tipoPeriferico}
                  onChange={e => setTipoPeriferico(e.target.value)}
                  required
                >
                  <option value="">Selecione o tipo</option>
                  <option value="teclado com fio">Teclado com fio</option>
                  <option value="mouse com fio">Mouse com fio</option>
                  <option value="teclado/mouse com fio">
                    Teclado/Mouse com fio
                  </option>
                  <option value="mochila">Mochila</option>
                  <option value="suporte ergonomico">Suporte ergonômico</option>
                  <option value="headset bilateral">Headset bilateral</option>
                  <option value="headset unilateral">Headset unilateral</option>
                  <option value="cabo de seguranca">Cabo de segurança</option>
                  <option value="hub usb">HUB usb</option>
                  <option value="dosckstation">Dockstation</option>
                  <option value="headset premium">Headset premium</option>
                  <option value="webcam">Monitor</option>
                  <option value="mouse sem fio">Mouse sem fio</option>
                  <option value="teclado sem fio">Teclado sem fio</option>
                </select>
              </div>
              <div>
                <label>Modelo:</label>
                <br />
                <input
                  type="text"
                  value={modeloPeriferico}
                  onChange={e => setModeloPeriferico(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Marca:</label>
                <br />
                <input
                  type="text"
                  value={marcaPeriferico}
                  onChange={e => setMarcaPeriferico(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>SKU:</label>
                <br />
                <input
                  type="text"
                  value={skuPeriferico}
                  onChange={e => setSkuPeriferico(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Nota Fiscal:</label>
                <br />
                <input
                  type="text"
                  value={notaFiscalPeriferico}
                  onChange={e => setNotaFiscalPeriferico(e.target.value)}
                  required
                />
              </div>
            </div>
            <br />

            <div className="planilha-container-cadastro">
              <table className="planilha-tabela">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Modelo</th>
                    <th>Marca</th>
                    <th>SKU</th>
                    <th>Nota Fiscal</th>
                    <th>Número de Série</th>
                  </tr>
                </thead>
                <tbody>
                  {perifericosList.map((p, index) => (
                    <tr key={index}>
                      <td>{tipoPeriferico}</td>
                      <td>{modeloPeriferico}</td>
                      <td>{marcaPeriferico}</td>
                      <td>{skuPeriferico}</td>
                      <td>{notaFiscalPeriferico}</td>
                      <td>
                        <input
                          type="text"
                          value={p.serialNumber}
                          onChange={e =>
                            handleSerialNumberPerifericoChange(
                              index,
                              e.target.value
                            )
                          }
                          required
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="botao">
              <button
                type="submit"
                disabled={loadingPeriferico}
                className="btn-download"
              >
                {loadingPeriferico ? "Cadastrando..." : "Cadastrar Periféricos"}
              </button>
            </div>
          </form>
        </div>
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  )
}

export default Cadastro
