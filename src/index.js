import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import { BrowserRouter } from 'react-router-dom'
import Web3Provider from 'web3-react'

import Connectors from './Components/Connectors'
import App from './Routes/App'
import './index.css'

ReactDOM.render(
  <Web3Provider connectors={Connectors} libraryName="ethers.js">
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Web3Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
