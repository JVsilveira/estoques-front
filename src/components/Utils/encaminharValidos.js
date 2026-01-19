import api from "../../api/api";

export const encaminharValidos = async (termosValidos, contexto) => {
  const ctx = (contexto || "").toUpperCase();

  if (ctx !== "ENTRADA" && ctx !== "SAIDA") {
    throw new Error("Contexto inválido");
  }

  if (!termosValidos?.length) {
    throw new Error("Nenhum termo válido para encaminhar");
  }

  for (const termo of termosValidos) {

    // ---------- ATIVOS ----------
    for (const ativo of termo.ativos || []) {
      if (!ativo.regiao) {
        throw new Error("Região não informada para ativo");
      }

      await api.post("/ativos", {
        tipo_item: ativo.tipo_item,
        marca: ativo.marca,
        modelo: ativo.modelo,
        nota_fiscal: ativo.nota_fiscal,
        numero_serie: ativo.numero_serie,
        contexto: ativo.contexto || ctx,
        regiao: ativo.regiao,
      });
    }

    // ---------- PERIFÉRICOS ----------
    for (const perif of termo.perifericos || []) {
      if (!perif.regiao) {
        throw new Error("Região não informada para periférico");
      }

      await api.post("/perifericos", {
        tipo_item: perif.tipo_item,
        quantidade: perif.quantidade,
        contexto: perif.contexto || ctx,
        regiao: perif.regiao,
      });
    }
  }

  return { sucesso: true };
};
