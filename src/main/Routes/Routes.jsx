import React from "react"
import Login from "../../components/Login/Login"
import { Routes, Route } from "react-router-dom"
import Home from "../../components/Home/Home"
import Screen from "../../components/Templates/Screen/Screen"
import Entrada from "../../components/Entrada/Entrada"
import Saida from "../../components/Saida/Saida"
import Cadastro from "../../components/Cadastro/Cadastro"
import Planilha from "../../components/Planilha/Planilha"
import { TransferEntradaProvider } from "../../components/Transfer/TransferEntrada"
import { TransferSaidaProvider } from "../../components/Transfer/TransferSaida"

export default () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/Planilha"
        element={
          <Screen>
            <TransferEntradaProvider>
              <TransferSaidaProvider>
              <Planilha />
              </TransferSaidaProvider>
            </TransferEntradaProvider>
          </Screen>
        }
      />
      <Route
        path="/Home"
        element={
          <Screen>
            <Home />
          </Screen>
        }
      />
      <Route
        path="/Saida"
        element={
          <Screen>
            <TransferEntradaProvider>
              <TransferSaidaProvider>
                <Saida />
              </TransferSaidaProvider>
            </TransferEntradaProvider>
          </Screen>
        }
      />
      <Route
        path="/Entrada"
        element={
          <Screen>
            <TransferEntradaProvider>
             <TransferSaidaProvider>
              <Entrada />
              </TransferSaidaProvider>
            </TransferEntradaProvider>
          </Screen>
        }
      />
      <Route
        path="/Cadastro"
        element={
          <Screen>
            <Cadastro />
          </Screen>
        }
      />
    </Routes>
  )
}
