import React, { useState } from "react"
import "./Cadastro.css"
import api from "../../api/api"
import { useAuth } from "../../api/authContext" // ✅ já contém token e usuário decodificado

function Cadastro() {
  // ---------- Autenticação ----------
  const { token, usuario } = useAuth()
  const role = usuario?.role || null
  const regiaoToken = usuario?.regiao || null

  // ---------- Regiões ----------

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
];


// Seletor de região para ATIVOS
const [regiaoSelecionadaAtivos, setRegiaoSelecionadaAtivos] = useState(
  role === "administrador" ? "TODAS" : regiaoToken
);

// Seletor de região para PERIFÉRICOS
const [regiaoSelecionadaPerifericos, setRegiaoSelecionadaPerifericos] = useState(
  role === "administrador" ? "TODAS" : regiaoToken
);

  // ---------- Estados de Ativos ----------
  const [modeloAtivo, setModeloAtivo] = useState("")
  const [marcaAtivo, setMarcaAtivo] = useState("")
  const [notaFiscalAtivo, setNotaFiscalAtivo] = useState("")
  const [quantidadeAtivo, setQuantidadeAtivo] = useState(1)
  const [ativosList, setAtivosList] = useState([])
  const [loadingAtivo, setLoadingAtivo] = useState(false)
  const [tipoAtivo, setTipoAtivo] = useState("")

  // ---------- Estados de Periféricos ----------
  const [tipoPeriferico, setTipoPeriferico] = useState("")
  const [quantidadePeriferico, setQuantidadePeriferico] = useState(1)
  const [loadingPeriferico, setLoadingPeriferico] = useState(false)
  const [perifericosList, setPerifericosList] = useState([])

  // ---------- ATIVOS ----------
  const handleAdicionarAtivo = () => {
    if (!tipoAtivo || !modeloAtivo || !marcaAtivo || !notaFiscalAtivo) {
      alert("Preencha todos os campos antes de adicionar o ativo.")
      return
    }

    const novosAtivos = Array.from({ length: quantidadeAtivo }, () => ({
      tipo_item: tipoAtivo,
      modelo: modeloAtivo,
      marca: marcaAtivo,
      nota_fiscal: notaFiscalAtivo,
      numero_serie: "",
    }))

    setAtivosList(prev => [...prev, ...novosAtivos])
    setQuantidadeAtivo(1)
  }

  const handleRemoverAtivo = index => {
    setAtivosList(ativosList.filter((_, i) => i !== index))
  }

  const handleSerialNumberAtivoChange = (index, value) => {
    const novos = [...ativosList]
    novos[index].numero_serie = value
    setAtivosList(novos)
  }

  const handleSubmitAtivo = async e => {
    e.preventDefault()

    if (ativosList.length === 0) {
      alert("Adicione ao menos um ativo antes de cadastrar.")
      return
    }

    if (ativosList.some(a => !a.numero_serie)) {
      alert("Preencha todos os números de série antes de cadastrar.")
      return
    }

    const regiaoFinal =
      role === "administrador" ? regiaoSelecionadaAtivos : regiaoToken

    if (!regiaoFinal) {
      alert("Selecione uma região antes de cadastrar.")
      return
    }

    setLoadingAtivo(true)

    try {
        const payloadAtivos = {
          regiao: role === "administrador" ? regiaoSelecionadaAtivos : regiaoToken,
          ativos: ativosList.map((a) => ({
            tipo_item: a.tipo_item,
            marca: a.marca,
            modelo: a.modelo,
            nota_fiscal: a.nota_fiscal,
            numero_serie: a.numero_serie,
          })),
          perifericos: [],
        };

        console.log("Payload enviado:", JSON.stringify(payloadAtivos, null, 2));

        await api.post("/entrada", payloadAtivos, {
          headers: { Authorization: `Bearer ${token}` },
        });

        alert("Ativos cadastrados com sucesso!");
        setTipoAtivo("");
        setModeloAtivo("");
        setMarcaAtivo("");
        setNotaFiscalAtivo("");
        setQuantidadeAtivo(1);
        setAtivosList([]);
      } catch (error) {
        console.error("Erro ao cadastrar ativos:", error);
        alert("Erro ao cadastrar ativos.");
      } finally {
        setLoadingAtivo(false);
      }
  }

  // ---------- PERIFÉRICOS ----------
  const handleAdicionarPeriferico = () => {
    if (!tipoPeriferico || quantidadePeriferico < 1) {
      alert("Informe o tipo e a quantidade do periférico.")
      return
    }

    setPerifericosList(prev => [
      ...prev,
      { tipo_item: tipoPeriferico, quantidade: quantidadePeriferico },
    ])

    setQuantidadePeriferico(1)
  }

  const handleRemoverPeriferico = index => {
    setPerifericosList(perifericosList.filter((_, i) => i !== index))
  }

  const handleSubmitPeriferico = async e => {
    e.preventDefault()

    if (perifericosList.length === 0) {
      alert("Adicione ao menos um periférico antes de cadastrar.")
      return
    }

    const regiaoFinal =
      role === "administrador" ? regiaoSelecionadaPerifericos : regiaoToken

    if (!regiaoFinal) {
      alert("Selecione uma região antes de cadastrar.")
      return
    }

    setLoadingPeriferico(true)

      try {
        const payloadPerifericos = {
          regiao: role === "administrador" ? regiaoSelecionadaPerifericos : regiaoToken,
          ativos: [],
          perifericos: perifericosList.map((p) => ({
          tipo_item: p.tipo_item,
          quantidade: p.quantidade,
          })),
        }

          console.log("Payload enviado:", JSON.stringify(payloadPerifericos, null, 2));

          await api.post("/entrada", payloadPerifericos, {
            headers: { Authorization: `Bearer ${token}` },
          });

          alert("Periféricos cadastrados com sucesso!");
          setTipoPeriferico("");
          setQuantidadePeriferico(1);
          setPerifericosList([]);
        } catch (error) {
          console.error("Erro ao cadastrar periféricos:", error);
          alert("Erro ao cadastrar periféricos.");
        } finally {
          setLoadingPeriferico(false);
        }
  }

  // ---------- JSX ----------
  return (
    <div className="cadastro">
      {/* ========== CADASTRO DE ATIVOS ========== */}
      <div className="inserirCadastro">
        <div className="titulo">CADASTRO DE ATIVOS</div>
        <form onSubmit={handleSubmitAtivo}>
          <div className="triagem">
          {role === "administrador" && (
            <div className="seletor-regiao">
              <label>Região (Ativos):</label>
              <select
                value={regiaoSelecionadaAtivos}
                onChange={(e) => setRegiaoSelecionadaAtivos(e.target.value)}
              >
                <option value="TODAS">Selecionar...</option>
                {regioesDisponiveis.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          )}

          
            <div>
              <label>Tipo:</label>
              <br />
              <select
                value={tipoAtivo}
                onChange={e => setTipoAtivo(e.target.value)}
                required
              >
                <option value="">Selecione</option>
                <option value="notebook">Notebook</option>
                <option value="desktop">Desktop</option>
                <option value="minidesktop">Minidesktop</option>
                <option value="monitor">Monitor</option>
                <option value="headset">Headset</option>
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
              <label>Nota Fiscal:</label>
              <br />
              <input
                type="text"
                value={notaFiscalAtivo}
                onChange={e => setNotaFiscalAtivo(e.target.value)}
                required
              />
            </div>

            <div>
              <label>Quantidade:</label>
              <br />
              <input
                type="number"
                min="1"
                value={quantidadeAtivo}
                onChange={e => setQuantidadeAtivo(Number(e.target.value))}
                required
              />
            </div>

            <div>
              <button
                type="button"
                className="btn-add"
                onClick={handleAdicionarAtivo}
              >
                Adicionar
              </button>
            </div>
          </div>

          {/* tabela de ativos */}
          <div className="planilha-container-cadastro">
            <table className="planilha-tabela">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Modelo</th>
                  <th>Marca</th>
                  <th>Nota Fiscal</th>
                  <th>Número de Série</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {ativosList.map((ativo, index) => (
                  <tr key={index}>
                    <td>{ativo.tipo_item}</td>
                    <td>{ativo.modelo}</td>
                    <td>{ativo.marca}</td>
                    <td>{ativo.nota_fiscal}</td>
                    <td>
                      <input
                        type="text"
                        value={ativo.numero_serie}
                        onChange={e =>
                          handleSerialNumberAtivoChange(index, e.target.value)
                        }
                        required
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => handleRemoverAtivo(index)}
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="botao">
            <button type="submit" disabled={loadingAtivo} className="btn-download">
              {loadingAtivo ? "Cadastrando..." : "Cadastrar Ativos"}
            </button>
          </div>
        </form>
      </div>

      {/* ========== CADASTRO DE PERIFÉRICOS ========== */}
      <div className="inserirCadastro">
        <div className="titulo">CADASTRO DE PERIFÉRICOS</div>
        <form onSubmit={handleSubmitPeriferico}>
          <div className="triagem">
          {role === "administrador" && (
            <div className="seletor-regiao">
              <label>Região (Periféricos):</label>
              <select
                value={regiaoSelecionadaPerifericos}
                onChange={(e) => setRegiaoSelecionadaPerifericos(e.target.value)}
              >
                <option value="TODAS">Selecionar...</option>
                {regioesDisponiveis.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          )}

          
            <div>
              <label>Tipo:</label>
              <br />
              <select
                value={tipoPeriferico}
                onChange={e => setTipoPeriferico(e.target.value)}
                required
              >
                <option value="">Selecione</option>
                <option value="teclado">Teclado</option>
                <option value="mouse">Mouse</option>
                <option value="mochila">Mochila</option>
                <option value="cabo de segurança">Cabo de segurança</option>
                <option value="hub usb">Hub USB</option>
                <option value="dockstation">Dockstation</option>
                <option value="suporte ergonômico">Suporte ergonômico</option>
              </select>
            </div>

            <div>
              <label>Quantidade:</label>
              <br />
              <input
                type="number"
                min="1"
                value={quantidadePeriferico}
                onChange={e => setQuantidadePeriferico(Number(e.target.value))}
                required
              />
            </div>

            <div>
              <button
                type="button"
                className="btn-add"
                onClick={handleAdicionarPeriferico}
              >
                Adicionar
              </button>
            </div>
          </div>

          {/* tabela de periféricos */}
          <div className="planilha-container-cadastro">
            <table className="planilha-tabela">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Quantidade</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {perifericosList.map((p, index) => (
                  <tr key={index}>
                    <td>{p.tipo_item}</td>
                    <td>{p.quantidade}</td>
                    <td>
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => handleRemoverPeriferico(index)}
                      >
                        Remover
                      </button>
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
    </div>
  )
}

export default Cadastro
