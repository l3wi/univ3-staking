import React from 'react'
import { Image } from '@chakra-ui/image'
import { IconButton } from '@chakra-ui/button'
import { FiSun, FiMoon } from 'react-icons/fi'
import { useColorMode, useColorModeValue } from '@chakra-ui/color-mode'
import { Box, Flex, LinkBox, LinkOverlay } from '@chakra-ui/layout'

import { useWeb3 } from '../../contexts/useWeb3'

import UserAddress from './wallet'

const Header = () => {
  const { account, balance } = useWeb3()
  const { colorMode, toggleColorMode } = useColorMode()

  const isDarkMode = colorMode === 'dark'
  const buttonHoverBgColor = useColorModeValue('gray.100', 'gray.700')

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" py={4}>
        {/* Hardcoded 283 for now to center user wallet component */}
        <LinkBox width={['auto', 'auto', 283]}>
          <LinkOverlay href="/">🏔</LinkOverlay>
        </LinkBox>
        <Box display={['none', 'none', 'none', 'block']}>
          {/* {account && <UserWallet />} */}
        </Box>
        <Box>
          <IconButton
            mr={2}
            borderRadius="lg"
            variant="ghost"
            onClick={toggleColorMode}
            icon={isDarkMode ? <FiMoon /> : <FiSun />}
            aria-label={isDarkMode ? 'Toggle light mode' : 'Toggle dark mode'}
            _hover={{ background: buttonHoverBgColor }}
          />
          <UserAddress />
        </Box>
      </Flex>
    </>
  )
}

export default Header
