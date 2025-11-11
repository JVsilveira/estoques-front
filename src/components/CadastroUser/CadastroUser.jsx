import { useEffect, useState } from "react"
import axios from "axios"
import "./CadastroUser.css"
import { useAuth } from "../../api/authContext"

const CadastroUser = () => {
  const { token, logout } = useAuth() // pega token diretamente do contexto

  const [nome, setNome] = useState("")
  const [senha, setSenha] = useState("")
  const [matricula, setMatricula] = useState("")
  const [tipoUsuario, setTipoUsuario] = useState("usuario")
  const [cargo, setCargo] = useState("")
  const [regiao, setRegiao] = useState("")

  const [usuarios, setUsuarios] = useState([]) // tabela de usuários
  const [editando, setEditando] = useState(null)
  const [dadosEdit, setDadosEdit] = useState({
    nome: "",
    matricula: "",
    tipo_usuario: "",
    cargo: "",
    regiao: "",
  })

  // Campo de busca
  const [busca, setBusca] = useState("")
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (busca.trim() !== "") {
        buscarUsuarios(busca)
      } else {
        setUsuarios([]) // limpa tabela se campo vazio
      }
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [busca])

  const buscarUsuarios = async termo => {
    if (!token) return
    try {
      const response = await axios.get(
        `http://localhost:8000/usuarios?nome=${encodeURIComponent(termo)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setUsuarios(response.data)
    } catch (error) {
      logout()
      setUsuarios([])
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!token) return

    try {
      const payload = {
        nome,
        matricula,
        senha,
        cargo,
        regiao,
        tipo_usuario: tipoUsuario,
      }
      await axios.post("http://localhost:8000/usuarios/", payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert("Usuário cadastrado com sucesso!")
      setNome("")
      setMatricula("")
      setSenha("")
      setCargo("")
      setRegiao("")
      setTipoUsuario("usuario")
      setUsuarios([]) // limpa tabela após cadastro
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error)
      alert(error.response?.data?.detail || "Erro ao cadastrar usuário.")
    }
  }

  const iniciarEdicao = usuario => {
    setEditando(usuario.matricula)
    setDadosEdit({
      nome: usuario.nome,
      matricula: usuario.matricula,
      tipo_usuario: usuario.tipo_usuario,
      cargo: usuario.cargo || "",
      regiao: usuario.regiao || "",
    })
  }

  const cancelarEdicao = () => {
    setEditando(null)
    setDadosEdit({
      nome: "",
      matricula: "",
      tipo_usuario: "",
      cargo: "",
      regiao: "",
    })
  }

  const salvarEdicao = async matriculaEdicao => {
    if (!token) return

    try {
      await axios.put(
        `http://localhost:8000/usuarios/${matriculaEdicao}`,
        dadosEdit,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert("Usuário atualizado com sucesso!")
      cancelarEdicao()
      buscarUsuarios(busca) // atualiza a lista
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error)
      alert("Erro ao atualizar usuário.")
    }
  }

  const deletarUsuario = async matriculaDel => {
    if (!token) return
    if (!window.confirm("Tem certeza que deseja deletar este usuário?")) return

    try {
      await axios.delete(`http://localhost:8000/usuarios/${matriculaDel}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsuarios(usuarios.filter(u => u.matricula !== matriculaDel))
      alert("Usuário deletado com sucesso!")
    } catch (error) {
      console.error("Erro ao deletar usuário:", error)
      alert("Erro ao deletar usuário.")
    }
  }

  return (
    <div className="entrada">
      <div className="inserir-usuario">
        <div className="titulo">CADASTRO DE USUÁRIO</div>

        <div className="cad-user">
          {/* Formulário de cadastro */}
          <div className="form-user">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Nome de usuário"
                value={nome}
                onChange={e => setNome(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Matrícula"
                value={matricula}
                onChange={e => setMatricula(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Cargo/Função"
                value={cargo}
                onChange={e => setCargo(e.target.value)}
              />
              <input
                type="text"
                placeholder="Região"
                value={regiao}
                onChange={e => setRegiao(e.target.value)}
              />
              <select
                value={tipoUsuario}
                onChange={e => setTipoUsuario(e.target.value)}
              >
                <option value="usuario">Usuário</option>
                <option value="administrador">Administrador</option>
              </select>
              <button type="submit">Cadastrar</button>
            </form>
          </div>

          {/* Lista de usuários */}
          <div className="lista-usuarios">
            <h2>Buscar Usuários</h2>
            <input
              type="text"
              placeholder="Digite o nome do usuário..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />

            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Matrícula</th>
                  <th>Função</th>
                  <th>Cargo</th>
                  <th>Região</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(usuario => (
                  <tr key={usuario.matricula}>
                    {editando === usuario.matricula ? (
                      <>
                        <td>
                          <input
                            value={dadosEdit.nome}
                            onChange={e =>
                              setDadosEdit({ ...dadosEdit, nome: e.target.value })
                            }
                          />
                        </td>
                        <td>{usuario.matricula}</td>
                        <td>
                          <select
                            value={dadosEdit.tipo_usuario}
                            onChange={e =>
                              setDadosEdit({
                                ...dadosEdit,
                                tipo_usuario: e.target.value,
                              })
                            }
                          >
                            <option value="usuario">Usuário</option>
                            <option value="administrador">Administrador</option>
                          </select>
                        </td>
                        <td>
                          <input
                            value={dadosEdit.cargo || ""}
                            onChange={e =>
                              setDadosEdit({ ...dadosEdit, cargo: e.target.value })
                            }
                          />
                        </td>
                        <td>
                          <input
                            value={dadosEdit.regiao || ""}
                            onChange={e =>
                              setDadosEdit({ ...dadosEdit, regiao: e.target.value })
                            }
                          />
                        </td>
                        <td>
                          <button onClick={() => salvarEdicao(usuario.matricula)}>
                            Salvar
                          </button>
                          <button onClick={cancelarEdicao}>Cancelar</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{usuario.nome}</td>
                        <td>{usuario.matricula}</td>
                        <td>{usuario.tipo_usuario}</td>
                        <td>{usuario.cargo}</td>
                        <td>{usuario.regiao || "-"}</td>
                        <td>
                          <button onClick={() => iniciarEdicao(usuario)}>
                            Editar
                          </button>
                          <button onClick={() => deletarUsuario(usuario.matricula)}>
                            Excluir
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CadastroUser
