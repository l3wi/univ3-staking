import { Box, Flex } from '@chakra-ui/layout'
import Footer from './footer'
import Header from './header'
import Alerts from './alerts'
import React from 'react'
import Head from 'next/head'

import { useColorModeValue } from '@chakra-ui/color-mode'

const Layout = ({ children, title }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.800')

  return (
    <Flex
      minHeight="100vh"
      flexDirection="column"
      backgroundColor={bgColor}
      px={[4, 4, 12]}
    >
      <Head>
        <title>{title ? title + ` - UniV3 Staker` : `UniV3 Staker`}</title>
        <link rel="icon" href="/favicon.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@lewifree" />
        <meta property="og:url" content="https://staker.projects.sh" />
        <meta property="og:title" content="Ribbon Finance (RBN) staker" />
        <meta
          property="og:description"
          content="An unofficial staking UI for the Ribbon reward program."
        />
        <meta
          property="og:image"
          content="https://staker.projects.sh/image.png"
        />
      </Head>
      <Alerts />
      <Header />
      <Box flexGrow={1}>{children}</Box>
      <Footer />
    </Flex>
  )
}
export default Layout
