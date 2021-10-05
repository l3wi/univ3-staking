import {
  v3Positions,
  v3Staker,
  v3Pool,
  RIBBON,
  ERC20,
  BATCHER,
  DSU_USDC
} from '../contracts'
import { commas } from '../utils/helpers'
import { ethers } from 'ethers'
import { web3 } from '../utils/ethers'

const dsu = [
  '0x24aE124c4CC33D6791F8E8B63520ed7107ac8b3e',
  '0x3432ef874A39BB3013e4d574017e0cCC6F937efD',
  1630272524,
  1638048524,
  '0xD05aCe63789cCb35B9cE71d01e4d632a0486Da4B'
]

// Find a matching incentive program.
// export const findIncentiveProgram = async (address) => {
//   const staking = new ethers.Contract(v3Staker.address, v3Staker.abi, web3)
//   const incentives = await staking.filters.IncentiveCreated()
//   const data = await staking.queryFilter(incentives, 13122700)
//   const program = data.find(
//     (item) => item.args.pool === '0x3432ef874A39BB3013e4d574017e0cCC6F937efD'
//   )
//   return program
// }

// Approve and Transfer the NFT in
export const depositNFT = async (tokenId, account) => {
  let iface = new ethers.utils.Interface(v3Positions.abi)
  const approveData = iface.encodeFunctionData('setApprovalForAll', [
    v3Staker.address,
    true
  ])
  const transferData = iface.encodeFunctionData(
    'safeTransferFrom(address,address,uint256)',
    [account, v3Staker.address, tokenId]
  )

  const signer = web3.getSigner()
  const manager = new ethers.Contract(
    v3Positions.address,
    v3Positions.abi,
    signer
  )

  const tx = await manager.multicall([approveData, transferData])
  return tx
}

export const stakeNFT = async (tokenId, program) => {
  const signer = web3.getSigner()
  const staking = new ethers.Contract(v3Staker.address, v3Staker.abi, signer)

  const tx = await staking.stakeToken(dsu, tokenId)
  return tx
}

// Fetch users claimable rewards
export const claimReward = async (tokenId, address, amount) => {
  let iface = new ethers.utils.Interface(v3Staker.abi)
  const unstakeData = iface.encodeFunctionData('unstakeToken', [dsu, tokenId])
  const claimData = iface.encodeFunctionData('claimReward', [
    '0x24ae124c4cc33d6791f8e8b63520ed7107ac8b3e',
    address,
    amount
  ])
  const stakeData = iface.encodeFunctionData('stakeToken', [dsu, tokenId])
  console.log(unstakeData)

  const signer = web3.getSigner()
  const staking = new ethers.Contract(v3Staker.address, v3Staker.abi, signer)

  const tx = await staking.multicall([unstakeData, claimData, stakeData])
  return tx
}

// Unstake, Claim & Exit
export const exitPool = async (tokenId, address, amount) => {
  let iface = new ethers.utils.Interface(v3Staker.abi)
  const unstakeData = iface.encodeFunctionData('unstakeToken', [dsu, tokenId])
  const claimData = iface.encodeFunctionData('claimReward', [
    '0x24ae124c4cc33d6791f8e8b63520ed7107ac8b3e',
    address,
    amount
  ])
  const withdrawData = iface.encodeFunctionData('withdrawToken', [
    tokenId,
    address,
    []
  ])

  const signer = web3.getSigner()
  const staking = new ethers.Contract(v3Staker.address, v3Staker.abi, signer)

  const tx = await staking.multicall([unstakeData, claimData, withdrawData])
  return tx
}

// Find users NFTs in pools
// Uses Promise.all rather than Multicall. Need to be optimised
export const findNFTByPool = async (address, poolAddress) => {
  const v3Manger = new ethers.Contract(
    v3Positions.address,
    v3Positions.abi,
    web3
  )
  const staking = new ethers.Contract(v3Staker.address, v3Staker.abi, web3)
  const pool = new ethers.Contract(poolAddress, v3Pool.abi, web3)
  const batcher = new ethers.Contract(BATCHER.address, BATCHER.abi, web3)

  // Get pool tokens
  const a = await pool.token0()
  const b = await pool.token1()

  // Fetch all UNI V3 NFTs owned by the address
  let nftList = []
  const nfts = await batcher.getIds(v3Positions.address, address) // REALLY HACKY
  nfts.map((id) => nftList.push({ id: id.toNumber(), address }))
  const stakerNfts = await batcher.getIds(v3Positions.address, v3Staker.address)
  stakerNfts.map((id) =>
    nftList.push({ id: id.toNumber(), address: v3Staker.address })
  )

  const fetchOne = async (owner, id) => {
    const pos = await v3Manger.positions(id)
    if (pos.liquidity.toString() === 0) return null
    if (pos.token0 != a && pos.token1 != a) return null
    if (pos.token0 != b && pos.token1 != b) return null

    const position = await staking.deposits(id)
    if (owner !== address && position.owner !== address) return null
    let deposited = position.tickLower != 0
    let staked = false
    let reward = null
    try {
      const [rewardNumber] = await staking.getRewardInfo(dsu, id)
      reward = rewardNumber.toString()
      staked = true
    } catch {}
    return {
      id,
      deposited,
      reward,
      staked
    }
  }

  // Enumerate all active positions
  let positions = await Promise.all(
    nftList.map((item) => fetchOne(item.address, item.id))
  )

  return positions.filter((item) => item)
}

export const getWETHPrice = async () => {
  const usdcContract = new ethers.Contract(
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
    ERC20.abi,
    web3
  )
  const wethContract = new ethers.Contract(
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
    ERC20.abi,
    web3
  )

  const dollarBal = ethers.utils.formatUnits(
    await usdcContract.balanceOf('0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc', {
      // USDC/WETH POOl
      gasLimit: 100000
    }),
    6
  )
  const wethBal = ethers.utils.formatUnits(
    await wethContract.balanceOf('0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc', {
      // USDC/WETH POOl
      gasLimit: 100000
    }),
    18
  )

  const wethPrice = parseInt(dollarBal) / parseInt(wethBal)
  console.log('WETH Price', wethPrice)
  return wethPrice
}
