import { useContext } from "react";
import { TransferEntrada } from "../Transfer/TransferEntrada";

export function useItensDisponiveis() {
  const { data } = useContext(TransferEntrada);
  return data || [];
}