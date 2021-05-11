import React, { useEffect, useState } from 'react'
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Divider,
  Flex,
} from '@chakra-ui/react'
import { Box, Heading, Text, Center, Link } from '@chakra-ui/layout'
import { Alert } from '@chakra-ui/alert'
import { Button, IconButton } from '@chakra-ui/button'

import { useColorModeValue } from '@chakra-ui/color-mode'

import Head from 'next/head'
import Page from '../components/page'
import { useWeb3 } from '../contexts/useWeb3'

import useCurrentBlock from '../hooks/useCurrentBlock'
import useContractBalance from '../hooks/useContractBalance'

import { usdc } from '../contracts'

export default function Home() {
  const cardBgColor = useColorModeValue('white', 'gray.700')
  const alertBgColor = useColorModeValue('gray.50', 'gray.600')

  const { web3, connectWallet, disconnectWallet, account, balance } = useWeb3()
  const block = useCurrentBlock()
  const usdcBalance = useContractBalance(usdc.address, 6)
  return (
    <Page>
      <Head>
        <title>Web3 Kitchen Sink</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box textAlign="center" mt={[8, 16, 24]}>
        <Heading size="lg" mb={2}>
          Web3 Kitchen Sink
        </Heading>
        <Text fontSize="lg" color="gray.500" mb={16}>
          Where will you go from here...
        </Text>
      </Box>

      <Center>
        <Box
          shadow="xl"
          borderRadius="2xl"
          p={4}
          bg={cardBgColor}
          borderWidth={1}
          width={['100%', 540, 540]}
        >
          <Alert
            mb={8}
            status="info"
            borderWidth={1}
            borderRadius="lg"
            borderColor="green.300"
            background={alertBgColor}
          >
            <Text>
              This example app will connect to your wallet and fetch your USDC
              balance and keep up to date with the latest blocks.
            </Text>
          </Alert>
          <Flex>
            <Stat>
              <StatLabel>ETH Balance</StatLabel>
              <StatNumber>{balance.toFixed(2)}</StatNumber>
              <StatHelpText>via the useWallet Context</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>USDC Balance</StatLabel>
              <StatNumber>{parseFloat(usdcBalance).toFixed(2)}</StatNumber>
              <StatHelpText>via the Contract Balance hook</StatHelpText>
            </Stat>
          </Flex>
          <p>Current Block: {block} </p>

          <Divider p={2} />
          {!account ? (
            <Button
              size="lg"
              isFullWidth
              color="white"
              background="green.300"
              _focus={{ boxShadow: 'none' }}
              _hover={{ background: 'green.400' }}
              onClick={() => connectWallet()}
            >
              Connect Wallet
            </Button>
          ) : (
            <Button
              size="lg"
              isFullWidth
              color="white"
              background="red.300"
              _focus={{ boxShadow: 'none' }}
              _hover={{ background: 'red.400' }}
              onClick={() => connectWallet()}
            >
              Disconnect Wallet
            </Button>
          )}
        </Box>
      </Center>
    </Page>
  )
}
