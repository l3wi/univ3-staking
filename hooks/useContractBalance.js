import { web3 } from '../utils/ethers'
import React, { useState, useEffect } from 'react'

const currentBlock = () => {
  let [block, setBlock] = useState(0)

  useEffect(() => {
    web3.on('block', (newBlock) => {
      if (newBlock > block && newBlock !== block) setBlock(newBlock)
    })
  }, [])

  return block
}

export default currentBlock
