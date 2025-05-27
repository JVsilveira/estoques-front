export function marcarItemComoEmUso(item, itensDisponiveis, setData) {
  const novosDados = itensDisponiveis.map(planilhaItem => {
    if (planilhaItem.serialNumber === item.serialNumber) {
      return { ...planilhaItem, disponibilidade: "Em Uso" }
    }
    return planilhaItem
  })
  setData(novosDados)
}