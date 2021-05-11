import { ethers } from 'ethers'
import { web3 } from '../utils/ethers'
import React, { useState, useEffect } from 'react'
import { useWeb3 } from '../contexts/useWeb3'

const currentBalance = (contract, digits) => {
  const { account } = useWeb3()
  let [block, setBlock] = useState(0)
  let [balance, setBalance] = useState(0)

  const erc20 = new ethers.Contract(
    contract,
    [
      {
        constant: true,
        inputs: [
          {
            name: '_owner',
            type: 'address',
          },
        ],
        name: 'balanceOf',
        outputs: [
          {
            name: 'balance',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
    ],
    web3
  )

  const fetchBalance = async () => {
    const rawNum = await erc20.balanceOf(account)
    const normalised = ethers.utils.formatUnits(rawNum, digits || 18)
    setBalance(normalised)
  }

  useEffect(() => {
    if (account) fetchBalance()
  }, [account])

  useEffect(() => {
    web3.on('block', async (newBlock) => {
      if (newBlock > block && newBlock !== block && account) {
        fetchBalance()
        setBlock(newBlock)
      }
    })
  }, [])

  return balance
}

export default currentBalance
