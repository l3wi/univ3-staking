import v3PoolABI from './univ3Pool.json'
import v3PositionsABI from './univ3Positions.json'
import v3StakerABI from './univ3Staker.json'
import batcherABI from './nftBatcher.json'
import erc20ABI from './erc20.json'

import { ETH_USDC_POOL } from '../constants'
import { STAKER } from '../constants/'
import { POSITIONS } from '../constants/'
import { NFTBATCHER } from '../constants/'

export const v3Staker = {
  abi: v3StakerABI,
  address: STAKER
}
export const v3Positions = {
  abi: v3PositionsABI,
  address: POSITIONS
}

export const v3Pool = { abi: v3PoolABI }

export const ETH_USDC = {
  abi: v3PoolABI,
  address: ETH_USDC_POOL
}

export const BATCHER = {
  abi: batcherABI,
  address: NFTBATCHER
}

export const ERC20 = {
  abi: erc20ABI
}
