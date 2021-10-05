import v3PoolABI from './univ3Pool.json'
import v3PositionsABI from './univ3Positions.json'
import v3StakerABI from './univ3Staker.json'
import batcherABI from './nftBatcher.json'
import erc20ABI from './erc20.json'

export const v3Staker = {
  abi: v3StakerABI,
  address: '0x1f98407aaB862CdDeF78Ed252D6f557aA5b0f00d'
}
export const v3Positions = {
  abi: v3PositionsABI,
  address: '0xc36442b4a4522e871399cd717abdd847ab11fe88'
}
export const v3Pool = { abi: v3PoolABI }

export const ETH_USDC = {
  abi: v3PoolABI,
  address: '0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8'
}

export const BATCHER = {
  abi: batcherABI,
  address: '0xF83eEE39E723526605d784917b6e38ebCF0f0207'
}

export const ERC20 = {
  abi: erc20ABI
}
