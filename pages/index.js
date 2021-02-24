import Head from 'next/head'
import { useWeb3 } from '../contexts/useWeb3'
import { web3 } from '../utils/ethers'

import useCurrentBlock from '../hooks/useCurrentBlock'

export default function Home() {
  const { web3, connectWallet, disconnectWallet, account } = useWeb3()
  const block = useCurrentBlock()

  return (
    <div>
      <Head>
        <title>Web3 Kitchen Sink</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          Web3 <a href="https://nextjs.org">Kitchen Sink</a>
        </h1>
        <p>Current Block: {block} </p>
        {!account ? (
          <p>
            Get started by hitting{' '}
            <button onClick={() => connectWallet('injected')}>
              connect wallet
            </button>
          </p>
        ) : (
          <div>
            <p> wallet connected: {account}</p>
            <button onClick={() => disconnectWallet()}>
              disconnect wallet
            </button>

            <p></p>
          </div>
        )}
      </main>

      <footer></footer>
    </div>
  )
}
