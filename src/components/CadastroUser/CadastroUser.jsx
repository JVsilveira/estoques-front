import { useEffect, useState } from "react"
import axios from "axios"
import "./CadastroUser.css"

const CadastroUser = () => {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [matricula, setMatricula] = useState("")
  const [role, setRole] = useState("USER")

  const [usuarios, setUsuarios] = useState([])
  const [busca, setBusca] = useState("")
  const [editando, setEditando] = useState(null)
  const [dadosEdit, setDadosEdit] = useState({
    nome: "",
    matricula: "",
    email: "",
    role: "",
  })

  // Carregar usuários ao iniciar
  useEffect(() => {
    carregarUsuarios()
  }, [])

  const carregarUsuarios = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(
        "http://localhost:8080/api/admin/usuarios",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      setUsuarios(response.data)
    } catch (error) {
      console.error("Erro ao carregar usuários:", error)
      // Dados fake para testes locais
      const usuariosFicticios = [
        {
          id: 1,
          nome: "João da Silva",
          matricula: "20231234",
          email: "joao.silva@example.com",
          role: "USER",
        },
        {
          id: 2,
          nome: "Maria Oliveira",
          matricula: "20239876",
          email: "maria.oliveira@example.com",
          role: "ADMIN",
        },
        {
          id: 3,
          nome: "Carlos Souza",
          matricula: "20237654",
          email: "carlos.souza@example.com",
          role: "USER",
        },
      ]
      setUsuarios(usuariosFicticios)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("token")

      await axios.post(
        "http://localhost:8080/api/admin/cadastrar",
        {
          nome,
          matricula,
          email,
          senha,
          role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      alert("Usuário cadastrado com sucesso!")
      setNome("")
      setMatricula("")
      setEmail("")
      setSenha("")
      setRole("USER")
      carregarUsuarios()
    } catch (error) {
      console.error("Erro ao cadastrar usuário", error)
      alert("Erro ao cadastrar usuário.")
    }
  }

  const iniciarEdicao = usuario => {
    setEditando(usuario.id)
    setDadosEdit({
      nome: usuario.nome,
      matricula: usuario.matricula,
      email: usuario.email,
      role: usuario.role,
    })
  }

  const cancelarEdicao = () => {
    setEditando(null)
    setDadosEdit({ nome: "", matricula: "", email: "", role: "" })
  }

  const salvarEdicao = async id => {
    try {
      const token = localStorage.getItem("token")

      await axios.put(
        `http://localhost:8080/api/admin/usuarios/${id}`,
        dadosEdit,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      alert("Usuário atualizado com sucesso!")
      cancelarEdicao()
      carregarUsuarios()
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error)
      alert("Erro ao atualizar.")
    }
  }

  const deletarUsuario = async id => {
    if (!window.confirm("Tem certeza que deseja deletar este usuário?")) return

    try {
      const token = localStorage.getItem("token")
      await axios.delete(`http://localhost:8080/api/admin/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setUsuarios(usuarios.filter(u => u.id !== id))
      alert("Usuário deletado com sucesso!")
    } catch (error) {
      console.error("Erro ao deletar usuário:", error)
      alert("Erro ao deletar.")
    }
  }

  const usuariosFiltrados = usuarios.filter(
    u =>
      u.nome.toLowerCase().includes(busca.toLowerCase()) ||
      u.matricula.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="entrada">
      <div className="inserir-usuario">
        <div className="titulo">CADASTRO DE USUÁRIO</div>
        <div className="cad-user">
          <div className="form-user">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Nome"
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
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
              />
              <select value={role} onChange={e => setRole(e.target.value)}>
                <option value="USER">Usuário</option>
                <option value="ADMIN">Administrador</option>
              </select>
              <button type="submit">Cadastrar</button>
            </form>
          </div>

          <div className="lista-usuarios">
            <h2>Usuários Cadastrados</h2>
            <input
              type="text"
              placeholder="Buscar por nome ou matrícula..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />

            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Matrícula</th>
                  <th>Email</th>
                  <th>Função</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map(usuario => (
                  <tr key={usuario.id}>
                    {editando === usuario.id ? (
                      <>
                        <td>
                          <input
                            value={dadosEdit.nome}
                            onChange={e =>
                              setDadosEdit({
                                ...dadosEdit,
                                nome: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td>
                          <input
                            value={dadosEdit.matricula}
                            onChange={e =>
                              setDadosEdit({
                                ...dadosEdit,
                                matricula: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td>
                          <input
                            value={dadosEdit.email}
                            onChange={e =>
                              setDadosEdit({
                                ...dadosEdit,
                                email: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td>
                          <select
                            value={dadosEdit.role}
                            onChange={e =>
                              setDadosEdit({
                                ...dadosEdit,
                                role: e.target.value,
                              })
                            }
                          >
                            <option value="USER">Usuário</option>
                            <option value="ADMIN">Administrador</option>
                          </select>
                        </td>
                        <td>
                          <button onClick={() => salvarEdicao(usuario.id)}>
                            Salvar
                          </button>
                          <button onClick={cancelarEdicao}>Cancelar</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{usuario.nome}</td>
                        <td>{usuario.matricula}</td>
                        <td>{usuario.email}</td>
                        <td>{usuario.role}</td>
                        <td>
                          <button onClick={() => iniciarEdicao(usuario)}>
                            Editar
                          </button>
                          <button onClick={() => deletarUsuario(usuario.id)}>
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
