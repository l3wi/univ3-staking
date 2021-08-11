import { ethers } from 'ethers'
import React, { useState, useEffect } from 'react'
import { useWeb3 } from '../contexts/useWeb3'
import { fetchBalance } from '../utils/ethers'

const currentBalance = (contract, digits, fixed) => {
  const { web3, account, status } = useWeb3()
  let [block, setBlock] = useState(0)
  let [balance, setBalance] = useState(0)

  useEffect(async () => {
    if (account && status === 'connected' && web3) {
      setBalance(await fetchBalance(contract, account, digits, fixed))
    }
  }, [account, status])

  useEffect(() => {
    web3.on('block', async (newBlock) => {
      if (newBlock > block && newBlock !== block && account) {
        setBalance(await fetchBalance(contract, account, digits, fixed))
        setBlock(newBlock)
      }
    })
  }, [])

  return balance
}

export default currentBalance
