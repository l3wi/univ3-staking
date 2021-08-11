import { ethers } from 'ethers'
import React, { useState, useEffect } from 'react'
import { useWeb3 } from '../contexts/useWeb3'
import { fetchAllowance } from '../utils/ethers'

const currentAllowance = (contract, spender, digits, fixed) => {
  const { web3, account, status } = useWeb3()
  let [block, setBlock] = useState(0)
  let [allowance, setAllowance] = useState(0)

  useEffect(async () => {
    if (account && status === 'connected') {
      setAllowance(
        await fetchAllowance(account, contract, spender, digits, fixed)
      )
    }
  }, [account, status])

  useEffect(() => {
    web3.on('block', async (newBlock) => {
      if (newBlock > block && newBlock !== block && account) {
        setAllowance(
          await fetchAllowance(account, contract, spender, digits, fixed)
        )
        setBlock(newBlock)
      }
    })
  }, [])

  return allowance
}

export default currentAllowance
