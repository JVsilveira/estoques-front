import React, { useState, useMemo } from "react"
import "./Saida.css"
import { uploadPdfs } from "../Utils/uploadPdfs"
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";
import { encaminharValidos} from "../Utils/encaminharValidos";
import { useAuth } from "../../api/authContext";



function Saida() {
  const { usuario } = useAuth()
  const regiaoToken = usuario?.regiao || ""
  const role = usuario?.role?.toUpperCase() || ""
  const [files, setFiles] = useState([])
  const [resultado, setResultado] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState("")
  const [regiaoSelecionada, setRegiaoSelecionada] = useState(
        role === "ADMINISTRADOR" ? "TODAS" : regiaoToken
     )


  const regioesDisponiveis = [
    "PISA", "SIGMA", "LAPA", "TRJ", "CEO",
    "MG", "RS", "SEMINÁRIO", "CE", "BA",
    "PE", "PA", "DF",
  ];

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setResultado(null);
    setError("");
  };

const handleUpload = async () => {
  if (!files.length) return;

  try {
    setProcessing(true);
    setError("");

    const data = await uploadPdfs(
      files,
      "SAIDA",
      role ==="ADMINISTRADOR" ? "TODAS" : regiaoToken
    );

    console.log("RESULTADO UPLOAD:", data);
    setResultado(data);
  } catch (err) {
    console.error(err);
    setError("Erro ao processar PDFs");
  } finally {
    setProcessing(false);
  }
};

  // ---------- DADOS PARA O GRÁFICO ----------
  const chartData = useMemo(() => {
    if (!resultado) return [];

    return [
      { name: "Termos válidos", value: resultado.quantidade_validos || 0 },
      { name: "Termos inválidos", value: resultado.quantidade_invalidos || 0 },
    ];
  }, [resultado]);

const enviarTermosValidos = async () => {
  if (!resultado?.termos_validos?.length) {
    alert("Nenhum termo válido encontrado.");
    return;
  }

  setProcessing(true);

  try {
    await encaminharValidos(
      resultado.termos_validos,
      resultado.contexto   // ✅ AGORA VAI
    );
    alert("Ativos e periféricos cadastrados com sucesso!");
  } catch (err) {
    console.error(err);
    alert(err.message || "Erro ao cadastrar ativos ou periféricos.");
  } finally {
    setProcessing(false);
  }
};

  return (
    <div className="saida">
      <div className="inserir">
        <div className="titulo">SAÍDA DE ATIVOS</div>

        <div className="arquivo">
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFileChange}
          />
          {processing && <div>Carregando...</div>}
          {error && <div className="error">{error}</div>}
        </div>
        {role === "ADMINISTRADOR" && (
            <div className="select-regiao">
              <label>Região do estoque:</label>
              <select
                value={regiaoSelecionada}
                onChange={(e) => setRegiaoSelecionada(e.target.value)}
              >
                <option value="">Selecione a região</option>
                {regioesDisponiveis.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
          )}
              <button
                onClick={handleUpload}
                disabled={
                  processing ||
                  !files.length ||
                  (role === "ADMINISTRADOR" && !regiaoSelecionada)
                }
              >
                {processing ? "Processando..." : "Processar PDFs"}
              </button>
               <div className="resultado-container">
               {resultado && (
                 <div className="resultado">
                   <h3>Resumo da auditoria</h3>
       
                   <PieChart width={300} height={300}>
                     <Pie data={chartData} dataKey="value" nameKey="name" label>
                       <Cell fill="#16a34a" />
                       <Cell fill="#dc2626" />
                     </Pie>
                     <Tooltip />
                     <Legend />
                   </PieChart>
       
                   <p>
                     <strong>Válidos:</strong> {resultado.quantidade_validos || 0}
                   </p>
                   <p>
                     <strong>Inválidos:</strong> {resultado.quantidade_invalidos || 0}
                   </p>
           
              {resultado.quantidade_invalidos > 0 && (
              <div className="erros">
                <h4>Termos inválidos</h4>
                <ul>
                  {resultado.termos_invalidos?.map((termo, idx) => (
                    <li key={idx}>
                      <strong>{termo.arquivo}</strong>
                      <ul>
                        {termo.erros_descricao?.map((erro, i) => (
                          <li key={i}>{erro}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        
                    {resultado.quantidade_validos > 0 && (
                      <button className="btn-validos" onClick={enviarTermosValidos} disabled={processing}>
                        Encaminhar somente termos válidos
                      </button>
                    )}
        
                    <p className="aviso">
                      Apenas os termos corretos e totalmente validados serão enviados ao
                      estoque.
                    </p>
                  </div>
                )}
              
      </div>
      </div>
    </div>
  )
}

export default Saida
