import React, { Suspense, useState, useEffect } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import './App.css'
import NavBar from './../Components/NavBar'
import Lend from './Lend'
import Borrow from './Borrow'

import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { useWeb3Context } from 'web3-react'

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
  const { library } = useWeb3Context()
  const [borrowTransactionHash, setBorrowTransactionHash] = useState()
  const [borrowContract, setBorrowContract] = useState()

  useEffect(() => {
    if (borrowTransactionHash) {
      library.waitForTransaction(borrowTransactionHash).then(receipt => {
        const address = receipt.logs[2].data
        setBorrowContract(`0x${address.substring(26, 66)}`)
        setBorrowTransactionHash()
      })
    }
  })

  return (
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
            <Route exact path="/lend" render={() => <Lend />} />
            <Route
              exact
              path="/borrow"
              render={() => (
                <Borrow setBorrowTransactionHash={setBorrowTransactionHash} borrowContract={borrowContract} setBorrowContract={setBorrowContract} />
              )}
            />
            <Redirect to="/lend" />
          </Switch>
        </Suspense>
      </div>
    </ThemeProvider>
  )
}

export default App
