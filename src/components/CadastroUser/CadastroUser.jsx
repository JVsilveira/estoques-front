import { useEffect, useState } from "react"
import axios from "axios"
import "./CadastroUser.css"

const CadastroUser = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [registrationNumber, setRegistrationNumber] = useState("")
  const [role, setRole] = useState("USER")
  const [region, setRegion] = useState("")

  const [usuarios, setUsuarios] = useState([])
  const [busca, setBusca] = useState("")
  const [editando, setEditando] = useState(null)
  const [dadosEdit, setDadosEdit] = useState({
    username: "",
    registration_number: "",
    email: "",
    role: "",
    region: "",
  })

  useEffect(() => {
    carregarUsuarios()
  }, [])

  const carregarUsuarios = async () => {
    try {
      const token = localStorage.getItem("access_token")
      const response = await axios.get("http://localhost:8080/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsuarios(response.data)
    } catch (error) {
      console.error("Erro ao carregar usuários:", error)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("access_token")
      const payload = {
        username,
        registration_number: registrationNumber,
        email,
        password,
        role,
        region,
      }
      await axios.post("http://localhost:8080/users", payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert("Usuário cadastrado com sucesso!")
      setUsername("")
      setRegistrationNumber("")
      setEmail("")
      setPassword("")
      setRole("USER")
      setRegion("")
      carregarUsuarios()
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error)
      alert("Erro ao cadastrar usuário.")
    }
  }

  const iniciarEdicao = usuario => {
    setEditando(usuario.id)
    setDadosEdit({
      username: usuario.username,
      registration_number: usuario.registration_number,
      email: usuario.email,
      role: usuario.role,
      region: usuario.region || "",
    })
  }

  const cancelarEdicao = () => {
    setEditando(null)
    setDadosEdit({
      username: "",
      registration_number: "",
      email: "",
      role: "",
      region: "",
    })
  }

  const salvarEdicao = async id => {
    try {
      const token = localStorage.getItem("access_token")
      await axios.put(`http://localhost:8080/users/${id}`, dadosEdit, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert("Usuário atualizado com sucesso!")
      cancelarEdicao()
      carregarUsuarios()
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error)
      alert("Erro ao atualizar usuário.")
    }
  }

  const deletarUsuario = async id => {
    if (!window.confirm("Tem certeza que deseja deletar este usuário?")) return
    try {
      const token = localStorage.getItem("access_token")
      await axios.delete(`http://localhost:8080/users/${id}`, {
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
      u.username.toLowerCase().includes(busca.toLowerCase()) ||
      u.registration_number.toLowerCase().includes(busca.toLowerCase())
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
                placeholder="Nome de usuário"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Matrícula"
                value={registrationNumber}
                onChange={e => setRegistrationNumber(e.target.value)}
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
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <select value={role} onChange={e => setRole(e.target.value)}>
                <option value="USER">Usuário</option>
                <option value="ADMIN">Administrador</option>
              </select>
              <input
                type="text"
                placeholder="Região"
                value={region}
                onChange={e => setRegion(e.target.value)}
              />
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
                  <th>Região</th>
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
                            value={dadosEdit.username}
                            onChange={e =>
                              setDadosEdit({
                                ...dadosEdit,
                                username: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td>
                          <input
                            value={dadosEdit.registration_number}
                            onChange={e =>
                              setDadosEdit({
                                ...dadosEdit,
                                registration_number: e.target.value,
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
                          <input
                            value={dadosEdit.region}
                            onChange={e =>
                              setDadosEdit({
                                ...dadosEdit,
                                region: e.target.value,
                              })
                            }
                          />
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
                        <td>{usuario.username}</td>
                        <td>{usuario.registration_number}</td>
                        <td>{usuario.email}</td>
                        <td>{usuario.role}</td>
                        <td>{usuario.region || "-"}</td>
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
