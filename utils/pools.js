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

import univ3prices from '@thanpolas/univ3prices'

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

  const tx = await staking.stakeToken(program, tokenId)
  return tx
}

// Fetch users claimable rewards
export const claimReward = async (tokenId, address, amount, program) => {
  let iface = new ethers.utils.Interface(v3Staker.abi)
  const unstakeData = iface.encodeFunctionData('unstakeToken', [
    program,
    tokenId
  ])
  const claimData = iface.encodeFunctionData('claimReward', [
    '0x24ae124c4cc33d6791f8e8b63520ed7107ac8b3e',
    address,
    amount
  ])
  const stakeData = iface.encodeFunctionData('stakeToken', [program, tokenId])

  const signer = web3.getSigner()
  const staking = new ethers.Contract(v3Staker.address, v3Staker.abi, signer)
  const tx = await staking.multicall([unstakeData, claimData, stakeData])
  return tx
}

// Unstake, Claim & Exit
export const exitPool = async (tokenId, address, amount, program) => {
  let iface = new ethers.utils.Interface(v3Staker.abi)
  const unstakeData = iface.encodeFunctionData('unstakeToken', [
    program,
    tokenId
  ])
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
export const findNFTByPool = async (address, program) => {
  // Get pool tokens
  const pool = new ethers.Contract(program[1], v3Pool.abi, web3)
  const a = await pool.token0()
  const b = await pool.token1()

  const v3Manger = new ethers.Contract(
    v3Positions.address,
    v3Positions.abi,
    web3
  )
  const staking = new ethers.Contract(v3Staker.address, v3Staker.abi, web3)
  const batcher = new ethers.Contract(BATCHER.address, BATCHER.abi, web3)

  // Fetch all UNI V3 NFTs owned by the Staker
  let nftList = []

  const nfts = await batcher.getIds(v3Positions.address, address) // User's NFTS
  nfts.map((id) => nftList.push({ id: id.toNumber(), address }))

  const stakerNfts = await batcher.getIds(v3Positions.address, v3Staker.address) //ALL NFTS in STAKER REALLY HACKY
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
      const [rewardNumber] = await staking.getRewardInfo(program, id)
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

// Fetches TVL of a XXX/ETH pool and returns prices
export const getPoolData = async (pool, token) => {
  const weth = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'

  const wethPrice = await getWETHPrice()
  const poolContract = new ethers.Contract(pool, v3Pool.abi, web3)

  const token0 = await poolContract.token0()
  const data = await poolContract.slot0()
  const ratio = univ3prices([18, 18], data.sqrtPriceX96).toAuto()

  const tokenPrice = token0 === weth ? wethPrice * ratio : wethPrice / ratio

  const wethContract = new ethers.Contract(weth, ERC20.abi, web3)
  const wethBalance = ethers.utils.formatUnits(
    await wethContract.balanceOf(pool),
    18
  )

  const tokenContract = new ethers.Contract(token, ERC20.abi, web3)
  const symbol = await tokenContract.symbol()
  const tokenBalance = ethers.utils.formatUnits(
    await tokenContract.balanceOf(pool),
    18
  )

  const tvl = tokenBalance * tokenPrice + wethPrice * wethBalance
  return { token: tokenPrice, symbol, weth: wethPrice, tvl }
}

export const getWETHPrice = async () => {
  const weth_usdc = '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640'
  const poolContract = new ethers.Contract(weth_usdc, v3Pool.abi, web3)
  const data = await poolContract.slot0()
  const ratio = univ3prices([6, 18], data.sqrtPriceX96).toAuto() // [] token decimals
  return ratio
}
