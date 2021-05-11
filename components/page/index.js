import { Box, Flex } from '@chakra-ui/layout'
import Footer from './footer'
import Header from './header'
import React from 'react'
import { useColorModeValue } from '@chakra-ui/color-mode'

const Layout = ({ children }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.800')

  return (
    <Flex
      minHeight="100vh"
      flexDirection="column"
      backgroundColor={bgColor}
      px={[4, 4, 12]}
    >
      <Header />
      <Box flexGrow={1}>{children}</Box>
      <Footer />
    </Flex>
  )
}
export default Layout
