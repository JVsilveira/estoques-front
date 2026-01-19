import api from "../../api/api"

export const uploadPdfs = async (files, contexto, regiao) => {
  const formData = new FormData();

  files.forEach(file => {
    formData.append("arquivos", file);
  });

  formData.append("contexto", contexto);

  if (regiao) {
    formData.append("regiao", regiao);
  }

  const { data } = await api.post(
    "/auditoria/processar-pdfs",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

