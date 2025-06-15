import React from "react"
import { Routes as ReactRoutes, Route } from "react-router-dom"
import Login from "../../components/Login/Login"
import Estoque from "../../components/Estoque/Estoque"
import Screen from "../../components/Templates/Screen/Screen"
import Entrada from "../../components/Entrada/Entrada"
import Saida from "../../components/Saida/Saida"
import Cadastro from "../../components/Cadastro/Cadastro"
import CadastroUser from "../../components/CadastroUser/CadastroUser"
import Planilha from "../../components/Planilha/Planilha"
import { TransferEntradaProvider } from "../../components/Transfer/TransferEntrada"
import { TransferSaidaProvider } from "../../components/Transfer/TransferSaida"
import PrivateRoute from "./PrivateRoute"
import RotaAdmin from "./RotaAdmin"

export default function Routes() {
  return (
    <ReactRoutes>
      <Route path="/" element={<Login />} />

      <Route
        path="/Planilha"
        element={
          <PrivateRoute>
            <Screen>
              <TransferEntradaProvider>
                <TransferSaidaProvider>
                  <Planilha />
                </TransferSaidaProvider>
              </TransferEntradaProvider>
            </Screen>
          </PrivateRoute>
        }
      />

      <Route
        path="/Home"
        element={
          <PrivateRoute>
            <Screen>
              <Estoque />
            </Screen>
          </PrivateRoute>
        }
      />

      <Route
        path="/Entrada"
        element={
          <PrivateRoute>
            <Screen>
              <TransferEntradaProvider>
                <TransferSaidaProvider>
                  <Entrada />
                </TransferSaidaProvider>
              </TransferEntradaProvider>
            </Screen>
          </PrivateRoute>
        }
      />

      <Route
        path="/Saida"
        element={
          <PrivateRoute>
            <Screen>
              <TransferEntradaProvider>
                <TransferSaidaProvider>
                  <Saida />
                </TransferSaidaProvider>
              </TransferEntradaProvider>
            </Screen>
          </PrivateRoute>
        }
      />

      <Route
        path="/Cadastro"
        element={
          <PrivateRoute>
            <Screen>
              <Cadastro />
            </Screen>
          </PrivateRoute>
        }
      />

      <Route
  path="/CadastroUser"
  element={
    <PrivateRoute>
      <RotaAdmin>
        <Screen>
        <CadastroUser />
        </Screen>
      </RotaAdmin>
    </PrivateRoute>
  }
/>
    </ReactRoutes>
  )
}
