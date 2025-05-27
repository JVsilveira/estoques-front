import React, { createContext, useState } from "react";

export const TransferSaida = createContext();

export function TransferSaidaProvider({ children }) {
  const [itemSaiu, setItemSaiu] = useState([]);

  const marcarComoSaiu = item => {
    setItemSaiu(prev => {
      const exists = prev.some(
        saida =>
          saida.serialNumber === item.serialNumber &&
          saida.modelo === item.modelo &&
          saida.marca === item.marca
      );
      return exists ? prev : [...prev, item];
    });
  };

  const limparItens = () => setItemSaiu([]);

  return (
    <TransferSaida.Provider
      value={{ itemSaiu, marcarComoSaiu, limparItens }}
    >
      {children}
    </TransferSaida.Provider>
  );
}