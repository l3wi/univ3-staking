export const IncentiveKey = [
  '0x6123B0049F904d730dB3C36a31167D9d4121fA6B',
  '0x94981F69F7483AF3ae218CbfE65233cC3c60d93a',
  1633694400,
  1638878400,
  '0xDAEada3d210D2f45874724BeEa03C7d4BBD41674'
]

export const APP = {
  title: "InsureDAO LP Staking",
  subTitle : "Stake your INSURE/ETH LP position"  
}

export const FAQ = [
  {
    title: "What is Liquidity Providing (LP)?",
    text: "Liquidity Providing (LP) is a new allows everyone to become a market maker. It's unique to Automated Market Makers (AMMs) like Uniswap & Curve. When you LP you are providing tokens to be used as a counter-party when someone wants to buy or sell a token.<br/>In exchange for providing liquidity, LPs receive fees on each trade. This can be very profitable for LPs on token pairs with high volume. However it can be risky to be an LP as high fluctuations in price may mean that you end up with less value in the long run, even when accounting for trading fees."
  },
  {
    title: "What is LP staking?",
    text: "Alongside trading fees, reward programs may be setup on top of Uniswap V3 to incentivize people to provide liquidity. With Uniswap V3, anyone can participate in these rewards programs by placing the NFT token they receive when providing liquidity into a special contract.<br />Once in this contract, the NFT will start to accrue rewarded tokens if the liquidity provided is \"in-range\". \"In-range\" simply means that the exchange rate (price) of the tokens being swapped falls within the range that the user chose when they provided liquidity.<br />Note: you can provide liquidity multiple times (accross different ranges) then stake those NFTs in the staker."
  },
  {
    title: "How do I stake my RBN tokens?",
    text: "In order to participate in the rewards program you must provide liquidity to a specific pool and then stake it in the staking contract.<br />The steps are as follows:<br /><br /><ol><li>Go to the <a href=\"https://app.uniswap.org/#/add/ETH/0x6123B0049F904d730dB3C36a31167D9d4121fA6B/10000\" target=\"_blank\" rel=\"nofollow\"> Uniswap v3 \"Add Liquidity\" page for RBN & ETH.</a></li><li>Select a range for your liquidity and supply the tokens.</li><li>Click \"Connect Wallet\" and choose a wallet provider.</li><li>Your LP NFTs will populate in the UI, select \"Deposit\" to transfer it ot the staking contract</li><li>Once the token is transfered, you must select \"Stake\" to start earning rewards.</li></ol>"
  },
  {
    title: "How do I claim my rewards?",
    text: "Once you have staked your NFT in the contract, denoted by a green \"STAKED\" badge in the UI, you will start to see rewards accruing. These rewards remain in the staking contract until you use the \"Claim\" or \"Exit\" buttons:<br /><br /><ul><li><b>Claim:</b> When you click \"Claim\" you are withdrawing your accumulated rewards to your wallet but your NFT stays within the staking contract, continuing to accrue rewards.</li><li><b>Exit:</b> When you click \"Exit\" you are withdrawing your accrued rewards and your NFT to your wallet. You will no longer accrue rewards, but you now can adjust your liquidity or withdraw your liquidity.</li></ul>"
  },
  {
    title: "Is this aI don't see my Uniswap LP position on the Uniswap website anymore. Why?",
    text: "When you stake your NFT, your NFT will be temporarily held on the Staker contract. This gives it the ability to earn RBN rewards for providing liquidity. When you Exit, the NFT will be returned back to your wallet.<br />To see details of the position, click the 'Token ID' link on the left-hand side of the position."
  },
  {
    title: "Is this an official site?",
    text: "No, this is website is unaffiliated with Uniswap or any token project. It was created to help people navigate the somewhat confusing Uniswap V3 Staker design. It is provided for your enjoyment and without any warranties. Be safe and double check your TXs before you send them.<br />If you'd like to check the source code or host your own site, please check out the Github link in the bottom right."
  }
]
