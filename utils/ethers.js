import { ethers } from 'ethers'
// Set provider for pre-render operations where no wallet is present.
// let provider = new ethers.providers.JsonRpcProvider(atob(ETH_NODE))
export let web3 = new ethers.providers.InfuraProvider(
  'homestead',
  process.env.INFURA
)

export const registerProvider = (wallet) => {
  if (wallet) {
    console.log('Using Wallet provider')
    web3 = new ethers.providers.Web3Provider(wallet)
  } else if (window && window.ethereum) {
    console.log('Using Window provider')
    web3 = new ethers.providers.Web3Provider(window.ethereum)
  }
}
