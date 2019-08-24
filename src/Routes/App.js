import React, { Suspense, useState } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Web3Provider from 'web3-react'

import Connectors from './../Components/Connectors'
import './App.css'
import NavBar from './../Components/NavBar'
import Lend from './Lend'
import Borrow from './Borrow'

import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'

const theme = createMuiTheme({
  typography: { useNextVariants: true },
  palette: {
    primary: {
      main: '#0e0b16'
    },
    secondary: {
      main: '#4717f6'
    }
  },
  secondary: {
    main: '#d1c4e9'
  }
})

function App() {
  const [lenderAddress, setLenderAddress] = useState()

  return (
    <Web3Provider connectors={Connectors} libraryName="ethers.js">
      <ThemeProvider theme={theme}>
        <NavBar />
        <div
          className="App"
          style={{
            maxWidth: '100%',
            height: 'auto',
            position: 'relative',
            overflow: 'scroll',
            paddingBottom: '100px',
            paddingTop: '150px',
            alignItems: 'center'
          }}
        >
          <Suspense fallback={null}>
            <Switch>
              <Route exact path="/lend" render={() => <Lend lenderAddress={lenderAddress} />} />
              <Route
                exact
                path="/borrow"
                render={() => <Borrow lenderAddress={lenderAddress} setLenderAddress={setLenderAddress} />}
              />
              <Redirect to="/lend" />
            </Switch>
          </Suspense>
        </div>
      </ThemeProvider>
    </Web3Provider>
  )
}

export default App
