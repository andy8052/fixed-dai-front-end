import React, { useState, useEffect, Fragment } from 'react'
import { ethers } from 'ethers'
import Typography from '@material-ui/core/Typography'

import { useMatcher } from '../hooks'
import { useWeb3Context } from 'web3-react'

const ONE_ETHER_IN_WEI = '1000000000000000000'

export default function Home() {
  const { library } = useWeb3Context()
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

  const [offers, setOffers] = useState()
  useEffect(() => {
    if (matcher) {
      matcher.best().then(async b => {
        let next = b
        let accumulatedOffers = []
        while (!next.isZero()) {
          const offer = await matcher.offers(b)
          accumulatedOffers.push(offer)
          next = offer.next
        }
        setOffers(accumulatedOffers)
      })
    }
  }, [matcher])

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

      {offers && (
        <Typography color={'primary'}>
          Offers:{' '}
          {offers.length === 0
            ? 'None'
            : offers.map((o, i) => (
                <Fragment key={i}>
                  <br />
                  Rate: {Number.parseFloat(o.rate.toString()) / 100}%
                  <br />
                  Amount: {Number.parseFloat(ethers.utils.formatEther(o.amount)).toPrecision(5)}
                  <br />
                  <br />
                </Fragment>
              ))}
        </Typography>
      )}

      <input
        type="number"
        disabled={!!!matcher || !offers} /*  || offers.length === 0 */
        value={inputValue}
        onChange={e => {
          setInputValue(e.target.value)
        }}
      />

      {outputError && <Typography color={'error'}>{outputError.message}</Typography>}
      {tradeData && (
        <Typography color={'primary'}>
          Rate: {Number.parseFloat(tradeData.rate.toString()) / 100}%
          <br />
          Minimum Ether: {Number.parseFloat(ethers.utils.formatEther(tradeData.minimumEth)).toPrecision(2)}
        </Typography>
      )}
    </>
  )
}
