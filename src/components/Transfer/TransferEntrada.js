import React, { createContext, useState } from "react";

export const TransferEntrada = createContext();

export function TransferEntradaProvider({ children }) {
  const [data, setData] = useState([]);

   const addData = (item) => {
    setData(prev => [...prev, item]);
  };

  return (
    <TransferEntrada.Provider value={{ data, setData, addData }}>
      {children}
    </TransferEntrada.Provider>
  );
}