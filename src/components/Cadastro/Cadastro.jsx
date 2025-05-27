import React, { useState } from 'react';
import './Cadastro.css';

function Cadastro() {
  // Estado para os dados comuns
  const [modelo, setModelo] = useState('');
  const [marca, setMarca] = useState('');
  const [sku, setSku] = useState('');
  const [notaFiscal, setNotaFiscal] = useState('');
  const [quantidade, setQuantidade] = useState(1); // Quantidade de ativos a cadastrar

  // Estado para o número de série e lista de ativos
  const [serialNumbers, setSerialNumbers] = useState([]);
  const [ativos, setAtivos] = useState([]);

  // Função para lidar com a seleção da quantidade de ativos
  const handleQuantidadeChange = (e) => {
    setQuantidade(e.target.value); // Atualizar a quantidade enquanto o usuário digita
  };

  // Função para validar e ajustar a quantidade após a digitação
  const handleQuantidadeBlur = () => {
    let qtd = parseInt(quantidade, 10);
    if (qtd < 1 || isNaN(qtd)) {
      qtd = 1; // Garantir que a quantidade seja no mínimo 1
    }
    setQuantidade(qtd);

    // Criar uma lista de ativos com número de série vazio para o usuário preencher
    setAtivos(new Array(qtd).fill({ serialNumber: '' }));
  };

  // Função para atualizar o número de série de um ativo específico
  const handleSerialNumberChange = (index, value) => {
    const newAtivos = [...ativos];
    newAtivos[index] = { ...newAtivos[index], serialNumber: value }; // Atualizando somente o serialNumber
    setAtivos(newAtivos);
  };

  // Função para enviar os dados (por exemplo, para outra tela ou API)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (ativos.some(ativo => !ativo.serialNumber)) {
      alert("Por favor, preencha todos os números de série antes de cadastrar.");
      return;
    }

    const dadosProduto = ativos.map((ativo) => ({
      modelo,
      marca,
      sku,
      notaFiscal,
      serialNumber: ativo.serialNumber,
    }));

    // Exibir os dados no console para ver os ativos cadastrados
    console.log('Ativos cadastrados:', dadosProduto);

    // Aqui você pode redirecionar o usuário para outra tela ou enviar os dados para uma API
  };

  return (
    <div className="cadastro">
      <div className="inserir">
        <div className="titulo">CADASTRO DE ATIVOS</div>

        <div className="ativos-cadastro">
          {/* Formulário para selecionar a quantidade de ativos */}
          <form onSubmit={handleSubmit}>
            <div className="triagem">
              <div>
                <label htmlFor="quantidade">Quantidade de Ativos:</label>
                <input
                  type="number"
                  id="quantidade"
                  value={quantidade}
                  onChange={handleQuantidadeChange} // Atualiza enquanto digita
                  onBlur={handleQuantidadeBlur} // Valida quando o campo perde o foco
                  min="1"
                  required
                />
              </div>

              {/* Preenchimento dos dados comuns */}
              <div>
                <label htmlFor="modelo">Modelo:</label>
                <input
                  type="text"
                  id="modelo"
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="marca">Marca:</label>
                <input
                  type="text"
                  id="marca"
                  value={marca}
                  onChange={(e) => setMarca(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="sku">SKU:</label>
                <input
                  type="text"
                  id="sku"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="notaFiscal">Nota Fiscal:</label>
                <input
                  type="text"
                  id="notaFiscal"
                  value={notaFiscal}
                  onChange={(e) => setNotaFiscal(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Exibição da tabela de ativos */}
            <div className="planilha-container">
              <table className="planilha-tabela">
                <thead>
                  <tr>
                    <th>Modelo</th>
                    <th>Marca</th>
                    <th>SKU</th>
                    <th>Nota Fiscal</th>
                    <th>Número de Série</th>
                  </tr>
                </thead>
                <tbody>
                  {ativos.map((ativo, index) => (
                    <tr key={index}>
                      <td>{modelo}</td>
                      <td>{marca}</td>
                      <td>{sku}</td>
                      <td>{notaFiscal}</td>
                      <td>
                        <input
                          type="text"
                          value={ativo.serialNumber}
                          onChange={(e) => handleSerialNumberChange(index, e.target.value)}
                          required
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="botao">
              <button type="submit">Cadastrar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;
