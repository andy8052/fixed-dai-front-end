import React, { useState, useEffect, Fragment } from 'react'
import { ethers } from 'ethers'
import Typography from '@material-ui/core/Typography'

import { useMatcher, useDAI } from '../hooks'
import { useWeb3Context } from 'web3-react'

const MAX_UINT256 = '115792089237316195423570985008687907853269984665640564039457584007913129639935'

export default function Lend() {
  const { library, account } = useWeb3Context()
  const matcher = useMatcher()
  const dai = useDAI()

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
      function get() {
        matcher.best().then(async b => {
          let next = b
          let accumulatedOffers = []
          while (!next.isZero()) {
            const offer = await matcher.offers(next)
            accumulatedOffers.push(offer)
            next = offer.next
          }
          setOffers(accumulatedOffers)
        })
      }
      library.on('block', get)
      get()
      return () => {
        library.removeListener('block', get)
      }
    }
  }, [matcher, library])

  const [daiAllowance, setDaiAllowance] = useState()
  useEffect(() => {
    if (dai && matcher) {
      function get() {
        dai.allowance(account, matcher.address).then(setDaiAllowance)
      }
      library.on('block', get)
      get()
      return () => {
        library.removeListener('block', get)
      }
    }
  }, [dai, matcher, library, account])

  function approveOrLend() {
    if (daiAllowance.isZero()) {
      dai.approve(matcher.address, MAX_UINT256)
    } else {
      try {
        const rate = ethers.utils.bigNumberify((Number.parseFloat(rateInput) * 100).toString())
        const amount = ethers.utils.parseEther(amountInput)
        let index
        if (offers.length === 0) {
          index = 0
        } else {
          index = offers.findIndex(o => rate.lt(o.rate))
          if (index === -1) {
            index = ethers.utils.bigNumberify(MAX_UINT256)
          }
        }
        matcher.make(rate, amount, index)
      } catch {}
    }
  }

  const [rateInput, setRateInput] = useState('')
  const [amountInput, setAmountInput] = useState('')

  return (
    <>
      {fee && (
        <Typography color={'primary'}>
          Compound Borrow Rate (DAI): {Number.parseFloat(fee.toString()) / 100}%
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
      Rate:{' '}
      <input
        disabled={!!!daiAllowance || daiAllowance.isZero()}
        type="number"
        value={rateInput}
        onChange={e => {
          setRateInput(e.target.value)
        }}
      />
      Amount:{' '}
      <input
        disabled={!!!daiAllowance || daiAllowance.isZero()}
        type="number"
        value={amountInput}
        onChange={e => {
          setAmountInput(e.target.value)
        }}
      />
      <button onClick={approveOrLend} disabled={!!!daiAllowance}>
        {daiAllowance && daiAllowance.isZero() ? 'Approve' : 'Lend'}
      </button>
    </>
  )
}
