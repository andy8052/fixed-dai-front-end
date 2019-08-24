import React, { useEffect } from 'react'
import { ethers } from 'ethers'
import { useWeb3Context, Connectors } from 'web3-react'
import Button from '@material-ui/core/Button'

const { Connector } = Connectors

const bStyle = {
  align: 'right',
  color: 'white'
}

export default function ConnectButton() {
  const { active, account, setConnector, error } = useWeb3Context()

  useEffect(() => {
    if (!active && !error && window.ethereum) {
      const library = new ethers.providers.Web3Provider(window.ethereum)
      library.listAccounts().then(accounts => {
        if (accounts.length >= 1) {
          setConnector('MetaMask', { suppressAndThrowErrors: true }).catch(() => {})
        }
      })
    }
  })

  return (
    <>
      {error ? (
        error.code === Connector.errorCodes.UNSUPPORTED_NETWORK ? (
          <p>Please switch to Rinkeby.</p>
        ) : (
          <p>An error occurred.</p>
        )
      ) : (
        <Button
          style={bStyle}
          disabled={active}
          onClick={() => {
            setConnector('MetaMask')
          }}
          variant="outlined"
          size="small"
          color="secondary"
        >
          {!active ? 'Connect Web3' : account.substring(0, 6) + '...' + account.substring(38, 42)}
        </Button>
      )}
    </>
  )
}
