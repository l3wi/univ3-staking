import React from 'react'
import { Image } from '@chakra-ui/image'
import { IconButton } from '@chakra-ui/button'
import { FiSun, FiMoon } from 'react-icons/fi'
import { useColorMode, useColorModeValue } from '@chakra-ui/color-mode'
import { Box, Flex, LinkBox, LinkOverlay } from '@chakra-ui/layout'
import { Heading, Text, Center } from '@chakra-ui/react'
import Ribbon from '../ribbon'
import { useWeb3 } from '../../contexts/useWeb3'

import UserAddress from './wallet'

const Header = () => {
  const { account, balance } = useWeb3()
  const { colorMode, toggleColorMode } = useColorMode()

  const isDarkMode = colorMode === 'dark'
  const buttonHoverBgColor = useColorModeValue('gray.100', 'gray.700')

  return (
    <Center>
      <Flex
        justifyContent="space-between"
        alignItems="flex-start"
        py={4}
        mt={4}
        w="100%"
        maxW={{ base: '100%', md: 960 }}
      >
        <Flex width={['auto', 'auto']}>
          <Ribbon w={64} h={64} />
          <Box ml="2">
            <Heading size="lg" mb={2}>
              Solace LP Staking
            </Heading>
            <Text fontSize="lg" color="gray.500">
              Stake your SOLACE/USDC LP position
            </Text>
          </Box>
        </Flex>
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
    </Center>
  )
}

export default Header
