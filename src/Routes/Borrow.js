import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Typography from '@material-ui/core/Typography'

import { useMatcher, useDAI } from '../hooks'
import { useWeb3Context } from 'web3-react'

const ONE_ETHER_IN_WEI = '1000000000000000000'
const MAX_UINT256 = '115792089237316195423570985008687907853269984665640564039457584007913129639935'

export default function Borrow() {
  const { library, account } = useWeb3Context()
  const matcher = useMatcher()
  const dai = useDAI()

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
    console.log('borrowing')
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
      {tradeData && <p>{`Rate: ${tradeData.rate.toString()}`}</p>}
    </>
  )
}
