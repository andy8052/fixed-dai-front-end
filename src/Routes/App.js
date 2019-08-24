import React, { Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import Web3Provider from 'web3-react'

import Connectors from './../Components/Connectors'
import './App.css'
import NavBar from './../Components/NavBar'
import Home from './Home'
import OpenLoan from './OpenLoan'
import AddLiquidity from './AddLiquidity'

import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'

const theme = createMuiTheme({
  typography: { useNextVariants: true },
  palette: {
    primary: {
      main: '#03a9f4'
    },
    secondary: {
      main: '#d1c4e9'
    }
  }
})

function App() {
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
              <Route exact path="/" component={Home} />
              <Route exact path="/open-loan" component={OpenLoan} />
              <Route exact path="/add-liquidity" component={AddLiquidity} />
            </Switch>
          </Suspense>
        </div>
      </ThemeProvider>
    </Web3Provider>
  )
}

export default App
