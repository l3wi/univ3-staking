import univ3prices from '@thanpolas/univ3prices';
import { BigNumber, ethers } from 'ethers';
import { BATCHER, ERC20, v3Pool, v3Positions, v3Staker } from '../contracts';
import { web3 } from '../utils/ethers';

import { PAIRED_TOKEN, ETH_USDC_POOL } from '../constants'

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

// OLD CALL --- Approve and Transfer the NFT in
export const depositNFT = async (tokenId, account) => {
  let iface = new ethers.utils.Interface(v3Positions.abi);
  const approveData = iface.encodeFunctionData('setApprovalForAll', [
    v3Staker.address,
    true
  ]);
  const transferData = iface.encodeFunctionData(
    'safeTransferFrom(address,address,uint256)',
    [account, v3Staker.address, tokenId]
  );

  const signer = web3.getSigner();
  const manager = new ethers.Contract(
    v3Positions.address,
    v3Positions.abi,
    signer
  );

  const tx = await manager.multicall([approveData, transferData]);
  return tx;
};

// NEW CALL -- Approve/Transfer the NFT in
export const depositStakeNFT = async (tokenId, account, program) => {
  const encoder = ethers.utils.defaultAbiCoder;
  const programCallData = encoder.encode(
    ['address', 'address', 'uint256', 'uint256', 'address'],
    program
  );

  let iface = new ethers.utils.Interface(v3Positions.abi);
  const approveData = iface.encodeFunctionData('setApprovalForAll', [
    v3Staker.address,
    true
  ]);
  const transferData = iface.encodeFunctionData(
    'safeTransferFrom(address,address,uint256, bytes)',
    [account, v3Staker.address, tokenId, programCallData]
  );

  const signer = web3.getSigner();
  const manager = new ethers.Contract(
    v3Positions.address,
    v3Positions.abi,
    signer
  );

  // Estimate & Bump gasLimit by 1.2x
  const gas = await manager.estimateGas.multicall([approveData, transferData]);
  const gasLimit = Math.ceil(gas.toNumber() * 1.2);

  const tx = await manager.multicall([approveData, transferData], {
    gasLimit
  });
  return tx;
};

export const withdrawNFT = async (tokenId, address) => {
  const signer = web3.getSigner();
  const staking = new ethers.Contract(v3Staker.address, v3Staker.abi, signer);

  const tx = await staking.withdrawToken(tokenId, address, []);
  return tx;
};

export const stakeNFT = async (tokenId, program) => {
  const signer = web3.getSigner();
  const staking = new ethers.Contract(v3Staker.address, v3Staker.abi, signer);

  const tx = await staking.stakeToken(program, tokenId);
  return tx;
};

// Fetch users claimable rewards
export const claimReward = async (tokenId, address, amount, program) => {
  let iface = new ethers.utils.Interface(v3Staker.abi);
  const unstakeData = iface.encodeFunctionData('unstakeToken', [
    program,
    tokenId
  ]);
  const claimData = iface.encodeFunctionData('claimReward', [
    program[0],
    address,
    amount
  ]);
  const stakeData = iface.encodeFunctionData('stakeToken', [program, tokenId]);

  const signer = web3.getSigner();
  const staking = new ethers.Contract(v3Staker.address, v3Staker.abi, signer);

  // Estimate & Bump gasLimit by 1.2x
  const gas = await staking.estimateGas.multicall([
    unstakeData,
    claimData,
    stakeData
  ]);
  const gasLimit = Math.ceil(gas.toNumber() * 1.2);

  const tx = await staking.multicall([unstakeData, claimData, stakeData], {
    gasLimit
  });
  return tx;
};

// Unstake, Claim & Exit
export const exitPool = async (tokenId, address, amount, program) => {

  let iface = new ethers.utils.Interface(v3Staker.abi);
  const unstakeData = iface.encodeFunctionData('unstakeToken', [
    program,
    tokenId
  ]);
  const claimData = iface.encodeFunctionData('claimReward', [
    program[0],
    address,
    amount
  ]);
  const withdrawData = iface.encodeFunctionData('withdrawToken', [
    tokenId,
    address,
    []
  ]);

  const signer = web3.getSigner();
  const staking = new ethers.Contract(v3Staker.address, v3Staker.abi, signer);

  // Estimate & Bump gasLimit by 1.2x
  const gas = await staking.estimateGas.multicall([unstakeData, claimData, withdrawData]);
  const gasLimit = Math.ceil(gas.toNumber() * 1.2);

  const tx = await staking.multicall([unstakeData, claimData, withdrawData], {
    gasLimit
  });
  return tx;
};

// Find users NFTs in pools
// Uses Promise.all rather than Multicall. Need to be optimised
export const findNFTByPool = async (address, program) => {
  // Get pool tokens
  const pool = new ethers.Contract(program[1], v3Pool.abi, web3);
  const a = await pool.token0();
  const b = await pool.token1();

  const manager = new ethers.Contract(v3Positions.address, v3Positions.abi, web3);
  const staker = new ethers.Contract(v3Staker.address, v3Staker.abi, web3);
  const batcher = new ethers.Contract(BATCHER.address, BATCHER.abi, web3);

  // Fetch all UNI V3 NFTs owned by the Staker
  let nftList = [];

  // Get a list of NFTs in the user's wallet
  const nfts = await batcher.getIds(v3Positions.address, address);

  nfts.map((id) => nftList.push({ id: id.toNumber(), address }));

  // Get a list of NFTs in the staker
  const stakerNfts = await batcher.getIds(v3Positions.address, v3Staker.address);

  stakerNfts.map((id) => nftList.push({ id: id.toNumber(), address: v3Staker.address }));

  // get all NFT Data data
  const nftData = await Promise.all(nftList.map(nft => manager.positions(nft.id)));

  // Filter out NFTs w/ no liquidity & unrelated to the pool we want
  // Hacky index lookup to nftList to roll important data over
  const poolNFTs = nftData
    .map((pos, i) => {
      if (pos.liquidity.toString() === 0) return false
      if (pos.token0 != a && pos.token1 != a) return false
      if (pos.token0 != b && pos.token1 != b) return false
      return { ...pos, id: nftList[i].id, address: nftList[i].address }
    })
    .filter((item) => item)

  // Query the staker to get the owner of the NFTs
  const activeNFTs = await Promise.all(poolNFTs.map(nft => staker.deposits(nft.id)));

  // Filter out the NFTs that aren't owned by the user account
  const userNFTs = activeNFTs
    .map((pos, i) => {
      const owner = poolNFTs[i].address;
      if (owner !== address && pos.owner !== address) return false;
      return {
        id: poolNFTs[i].id,
        address: poolNFTs[i].address,
        position: poolNFTs[i]
      };
    })
    .filter((item) => item);

  /// Finally check to see if the token has rewarded, ie staked
  const fetchOne = async (token) => {
    let deposited = v3Staker.address === token.address;
    let staked = false;
    let reward = null;

    const MAX_UINT128 = BigNumber.from(2).pow(128).sub(1);
    const tokenIdHexString = BigNumber.from(token.id).toHexString();
    const fees = await manager.callStatic.collect({
      tokenId: tokenIdHexString,
      recipient: address, // some tokens might fail if transferred to address(0)
      amount0Max: MAX_UINT128,
      amount1Max: MAX_UINT128
    });

    try {
      const [rewardNumber] = await staker.getRewardInfo(
        program,
        token.id
      );
      reward = rewardNumber.toString();
      staked = true;
    } catch { }

    return {
      id: token.id,
      deposited,
      reward,
      staked,
      liquidity: token.position.liquidity.toString(),
      tickLower: token.position.tickLower,
      tickUpper: token.position.tickUpper,
      fees0: (ethers.utils.formatUnits(fees.amount0) * 1e12).toString(),
      fees1: ethers.utils.formatUnits(fees.amount1)
    };
  };

  // Enumerate all active positions
  let positions = await Promise.all(userNFTs.map((item) => fetchOne(item)));

  return positions;
};

// Fetches TVL of a XXX/ETH pool and returns prices
export const getPoolData = async (pool, token) => {
  const weth = PAIRED_TOKEN;

  const wethPrice = await getWETHPrice();
  const poolContract = new ethers.Contract(pool, v3Pool.abi, web3);

  const token0 = await poolContract.token0();
  const data = await poolContract.slot0();
  console.log(token0)
  const spacing = await poolContract.tickSpacing();
  const liquidity = await poolContract.liquidity();
  const ratio = univ3prices([6, 18], data.sqrtPriceX96).toAuto();
  console.log('ratio', ratio)
  const tokenPrice = token0 === weth ? wethPrice * ratio : wethPrice / ratio;
  console.log('tokenPrice', tokenPrice);
  const wethContract = new ethers.Contract(weth, ERC20.abi, web3);
  const wethBalance = ethers.utils.formatUnits(
    await wethContract.balanceOf(pool),
    6
  );

  const tokenContract = new ethers.Contract(token, ERC20.abi, web3);
  const symbol = await tokenContract.symbol();
  const tokenBalance = ethers.utils.formatUnits(
    await tokenContract.balanceOf(pool),
    18
  );

  const tvl = tokenBalance * tokenPrice + wethPrice * wethBalance;
  return {
    token: tokenPrice,
    symbol,
    weth: wethPrice,
    tvl,
    tick: data.tick,
    spacing,
    liquidity: liquidity.toString()
  };
};

export const getWETHPrice = async () => {
  const weth_usdc = ETH_USDC_POOL;
  const poolContract = new ethers.Contract(weth_usdc, v3Pool.abi, web3);
  const data = await poolContract.slot0();
  const ratio = univ3prices([6, 6], data.sqrtPriceX96).toAuto(); // [] token decimals
  return ratio;
};
