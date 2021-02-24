import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { Web3Provider } from '../contexts/useWeb3'
import { useWallet, UseWalletProvider } from 'use-wallet'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Helvetica", sans-serif, monospace;
  }
`

const theme = {
  colors: {
    primary: '#0070f3',
  },
}

export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <UseWalletProvider chainId={1}>
          <Web3Provider>
            <Component {...pageProps} />
          </Web3Provider>
        </UseWalletProvider>
      </ThemeProvider>
    </>
  )
}
