import { useMemo } from 'react'
import { ethers } from 'ethers'
import { useWeb3Context } from 'web3-react'

import { MATCHER, DAI } from '../constants'
import MATCHER_ABI from '../constants/matcher'
import DAI_ABI from '../constants/dai'
import UncheckedJsonRpcSigner from './signer'

export function isAddress(value) {
  try {
    return ethers.utils.getAddress(value.toLowerCase())
  } catch {
    return false
  }
}

// account is optional
export function getProviderOrSigner(library, account) {
  return account ? new UncheckedJsonRpcSigner(library.getSigner(account)) : library
}

export function getContract(address, ABI, library, account) {
  if (!isAddress(address) || address === ethers.constants.AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new ethers.Contract(address, ABI, getProviderOrSigner(library, account))
}

export function useContract(address, ABI, withSignerIfPossible = true) {
  const { library, account } = useWeb3Context()

  return useMemo(() => {
    try {
      return getContract(address, ABI, library, withSignerIfPossible ? account : null)
    } catch (e) {
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useDAI() {
  return useContract(DAI, DAI_ABI)
}

export function useMatcher() {
  return useContract(MATCHER, MATCHER_ABI)
}
