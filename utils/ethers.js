import { ethers } from 'ethers'
// Set provider for pre-render operations where no wallet is present.
// let provider = new ethers.providers.JsonRpcProvider(atob(ETH_NODE))
// export let web3 = new ethers.providers.getDefaultProvider()
export const chainID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID) ? parseInt(process.env.NEXT_PUBLIC_CHAIN_ID) : 1
console.log('chainID', chainID)
console.log('direct chainID', process.env.NEXT_PUBLIC_CHAIN_ID)
export let web3 = new ethers.providers.InfuraProvider(
  chainID === 1 ? 'homestead' : 'rinkeby',
  process.env.INFURA
)

const MaxUint = ethers.constants.MaxUint256
export const zeroAddress = ethers.constants.AddressZero

export const registerProvider = (wallet) => {
  if (wallet) {
    console.log('Using Wallet provider walletconnect')
    try {
      web3 = new ethers.providers.Web3Provider(wallet)
      wallet.on('chainChanged', (_chainId) => window.location.reload())
    } catch (error) {
      console.log(error)
    }
  } else if (window && window.ethereum) {
    console.log('Using Window provider metamask')
    web3 = new ethers.providers.Web3Provider(window.ethereum)
    window.ethereum.on('chainChanged', (_chainId) => window.location.reload())
  }
}

export const setApproval = async (contract, spender, amount) => {
  const signer = web3.getSigner()
  const erc20 = new ethers.Contract(
    contract,
    [
      {
        constant: false,
        inputs: [
          {
            name: '_spender',
            type: 'address'
          },
          {
            name: '_value',
            type: 'uint256'
          }
        ],
        name: 'approve',
        outputs: [
          {
            name: '',
            type: 'bool'
          }
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ],
    signer
  )
  try {
    return await erc20.approve(spender, amount ? amount : MaxUint)
  } catch (error) {
    return error
  }
}

export const fetchBalance = async (contract, account, digits, fixed) => {
  const erc20 = new ethers.Contract(
    contract,
    [
      {
        constant: true,
        inputs: [
          {
            name: '_owner',
            type: 'address'
          }
        ],
        name: 'balanceOf',
        outputs: [
          {
            name: 'balance',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      }
    ],
    web3
  )

  const rawNum = await erc20.balanceOf(account)
  const normalised = parseFloat(
    ethers.utils.formatUnits(rawNum, digits || 18)
  ).toFixedNoRounding(fixed ? fixed : 2)
  return normalised
}

export const fetchAllowance = async (
  account,
  contract,
  spender,
  digits,
  fixed
) => {
  const erc20 = new ethers.Contract(
    contract,
    [
      {
        constant: true,
        inputs: [
          {
            name: '_owner',
            type: 'address'
          },
          {
            name: '_spender',
            type: 'address'
          }
        ],
        name: 'allowance',
        outputs: [
          {
            name: '',
            type: 'uint256'
          }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      }
    ],
    web3
  )

  const rawNum = await erc20.allowance(account, spender)
  const normalised = parseFloat(
    ethers.utils.formatUnits(rawNum, digits || 18)
  ).toFixedNoRounding(fixed ? fixed : 4)
  return normalised
}

export const getSymbol = async (contract) => {
  const cont = new ethers.Contract(contract.address, contract.abi, web3)
  return await cont.symbol({ gasLimit: 100000 })
}
export const getSupply = async (contract, digits, fixed) => {
  const cont = new ethers.Contract(contract.address, contract.abi, web3)
  const rawNum = await cont.totalSupply()
  const normalised = parseFloat(
    ethers.utils.formatUnits(rawNum, digits || 18)
  ).toFixedNoRounding(fixed ? fixed : 4)
  return normalised
}
