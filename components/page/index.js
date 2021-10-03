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
        <title>{title ? title + `- page title` : `page title`}</title>
        <link rel="icon" href="/favicon.png" />
        {/* 
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@lewifree" />
        <meta property="og:url" content="https://url.com" />
        <meta property="og:title" content="Project Name" />
        <meta property="og:description" content="A simple starter for web3." />
        <meta
          property="og:image"
          content="https://url.com"
        /> */}
      </Head>
      <Alerts />
      <Header />
      <Box flexGrow={1}>{children}</Box>
      <Footer />
    </Flex>
  )
}
export default Layout
