import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Typography from '@material-ui/core/Typography'

import { useMatcher } from '../hooks'
import { useWeb3Context } from 'web3-react'

const ONE_ETHER_IN_WEI = '1000000000000000000'

export default function Borrow({ setBorrowTransactionHash, borrowContract }) {
  const { library, account } = useWeb3Context()
  const matcher = useMatcher()

  const [daiPrice, setDaiPrice] = useState()
  useEffect(() => {
    if (matcher) {
      function get() {
        matcher.getDaiPrice().then(setDaiPrice)
      }
      library.on('block', get)
      get()
      return () => {
        library.removeListener('block', get)
      }
    }
  }, [matcher, library])

  const [fee, setFee] = useState()
  useEffect(() => {
    if (matcher) {
      function get() {
        matcher.getStabilityFee().then(setFee)
      }
      library.on('block', get)
      get()
      return () => {
        library.removeListener('block', get)
      }
    }
  }, [matcher, library])

  const [inputValue, setInputValue] = useState('')
  const [tradeData, setTradeData] = useState()
  const [outputError, setOutputError] = useState()
  useEffect(() => {
    if (matcher) {
      try {
        const daiToDraw = ethers.utils.parseEther(inputValue)
        matcher
          .matchOffers(daiToDraw)
          .then(r => {
            const minimumEth = daiToDraw
              .mul(daiPrice)
              .div(ONE_ETHER_IN_WEI)
              .mul(ethers.utils.bigNumberify('15000'))
              .div(ethers.utils.bigNumberify('10000'))

            setTradeData({
              rate: r[1],
              minimumEth
            })
          })
          .catch(() => {
            setOutputError(Error('Not enough liquidity!'))
          })
      } catch {
        if (inputValue && inputValue !== '') {
          setOutputError(Error('Error!'))
        }
      }

      return () => {
        setTradeData()
        setOutputError()
      }
    }
  }, [matcher, inputValue, daiPrice])

  function borrow() {
    matcher
      .open(ethers.utils.parseEther(inputValue), {
        value: tradeData.minimumEth.mul(ethers.utils.bigNumberify('120')).div(ethers.utils.bigNumberify('100'))
      })
      .then(res => {
        setBorrowTransactionHash(res.hash)
      })
  }

  return (
    <>
      {fee && (
        <Typography color={'primary'}>
          Compound Borrow Rate (DAI): {Number.parseFloat(fee.toString()) / 100}%
        </Typography>
      )}
      {daiPrice && (
        <Typography color={'primary'}>
          Price (ETH): {(1 / Number.parseFloat(ethers.utils.formatEther(daiPrice))).toPrecision(5)} DAI / 1 ETH
        </Typography>
      )}
      Amount (DAI):{' '}
      <input
        type="number"
        disabled={!account}
        value={inputValue}
        onChange={e => {
          setInputValue(e.target.value)
        }}
      />
      <button onClick={borrow}>Borrow</button>
      {outputError && <p>{outputError.message}</p>}
      {tradeData && tradeData.rate && <p>{`Rate: ${Number.parseFloat(tradeData.rate.toString()) / 100}%`}</p>}
      {tradeData && tradeData.minimumEth && (
        <p>{`Collateral Required (ETH): ${ethers.utils.formatEther(tradeData.minimumEth)}`}</p>
      )}
    </>
  )
}
