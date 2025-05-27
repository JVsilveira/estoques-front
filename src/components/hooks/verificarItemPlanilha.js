export function verificarItemNaPlanilha(item, itensDisponiveis) {
  return itensDisponiveis.some(planilhaItem =>
    planilhaItem.serialNumber === item.serialNumber
  );
}