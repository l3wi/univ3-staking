import React, { useEffect, useState } from 'react'
import {
  Stat,
  StatLabel,
  StatNumber,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Image,
  Badge
} from '@chakra-ui/react'
import { Box, Heading, Text, Center, Link } from '@chakra-ui/layout'
import { useColorModeValue } from '@chakra-ui/color-mode'

import Page from '../components/page'
import FAQs from '../components/faqs'
import { useWeb3 } from '../contexts/useWeb3'
import { useAlerts } from '../contexts/useAlerts'

import { commas } from '../utils/helpers'

import {
  findNFTByPool,
  depositNFT,
  stakeNFT,
  claimReward,
  exitPool
} from '../utils/pools'
import useCurrentBlock from '../hooks/useCurrentBlock'
import { comma } from '../utils/helpers'

const dsu = [
  '0x24aE124c4CC33D6791F8E8B63520ed7107ac8b3e',
  '0x3432ef874A39BB3013e4d574017e0cCC6F937efD',
  1630272524,
  1638048524,
  '0xD05aCe63789cCb35B9cE71d01e4d632a0486Da4B'
]

const program = [
  '0x6123B0049F904d730dB3C36a31167D9d4121fA6B',
  '0x94981F69F7483AF3ae218CbfE65233cC3c60d93a',
  1633564800,
  1638748800,
  '0xDAEada3d210D2f45874724BeEa03C7d4BBD41674'
]

export default function Home() {
  const cardBgColor = useColorModeValue('white', 'gray.700')

  const { account, block } = useWeb3()
  const { watchTx, alerts } = useAlerts()

  const [positions, setPositions] = useState([])

  const deposit = async (id) => {
    const tx = await depositNFT(id, account)
    watchTx(tx.hash, 'Depositing NFT')
  }
  const stake = async (id) => {
    const tx = await stakeNFT(id)
    watchTx(tx.hash, 'Staking NFT')
  }
  const claim = async (id, reward) => {
    const tx = await claimReward(id, account, reward)
    watchTx(tx.hash, 'Claiming rewards')
  }

  const exit = async (id, reward) => {
    const tx = await exitPool(id, account, reward)
    watchTx(tx.hash, 'Exiting pool & claiming rewards')
  }

  useEffect(async () => {
    if (account) {
      const lpPositions = await findNFTByPool(
        account,
        '0x3432ef874a39bb3013e4d574017e0ccc6f937efd'
      )

      setPositions(lpPositions)
      console.log(lpPositions)
    }
  }, [account, alerts, block])

  return (
    <Page title="RBN/ETH">
      <Center>
        <Flex
          flexDirection="column"
          w="100%"
          maxW={{ base: '100%', md: 800 }}
          mt={16}
          alignItems="flex-start"
        >
          <Flex w="100%" maxW={['100%', 800]} mb={8}>
            <Stat>
              <StatLabel>Staking APR</StatLabel>
              <StatNumber>{`45%`}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Pool TVL</StatLabel>
              <StatNumber>{`$2,293,091`}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Claimable Rewards</StatLabel>
              <StatNumber>
                {positions[0] &&
                  commas(
                    positions
                      .map((i) => (i.reward ? i.reward / 1e18 : 0))
                      .reduce((a, b) => a + b)
                  )}
                {` RBN`}
              </StatNumber>
            </Stat>
          </Flex>

          <Heading size="md" mb="5">
            Your RBN/ETH positions
          </Heading>
          <Box
            shadow="xl"
            borderRadius="2xl"
            p={4}
            bg={cardBgColor}
            borderWidth={1}
            w="100%"
            maxW={['100%', 800]}
          >
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Token ID</Th>
                  <Th>Location</Th>
                  <Th isNumeric>Unclaimed Rewards</Th>
                  <Th isNumeric></Th>
                </Tr>
              </Thead>

              {positions[0] ? (
                <Tbody>
                  {positions.map((position) => (
                    <Tr key={position.id}>
                      <Td>
                        <Flex align="center">
                          <Image src="/uni.svg" w="24px" m="0 10px 0 0" />#
                          {position.id}
                        </Flex>
                      </Td>
                      <Td>
                        {!position.deposited && (
                          <Badge rounded="full" px="2" colorScheme="blue">
                            WALLET
                          </Badge>
                        )}
                        {position.deposited && !position.staked ? (
                          <Badge rounded="full" px="2" colorScheme="yellow">
                            STAKER
                          </Badge>
                        ) : null}
                        {position.deposited && position.staked ? (
                          <Badge rounded="full" px="2" colorScheme="teal">
                            STAKED
                          </Badge>
                        ) : null}
                      </Td>

                      <Td isNumeric>{commas(position.reward / 1e18)} RBN</Td>
                      <Td isNumeric>
                        <Flex>
                          {!position.deposited && (
                            <Button
                              colorScheme="green"
                              mr="2"
                              onClick={() => deposit(position.id)}
                            >
                              Deposit LP
                            </Button>
                          )}
                          {position.deposited && !position.staked ? (
                            <Button
                              colorScheme="purple"
                              mr="2"
                              onClick={() => stake(position.id)}
                            >
                              Stake LP
                            </Button>
                          ) : null}
                          {position.deposited && position.staked ? (
                            <>
                              <Button
                                colorScheme="orange"
                                mr="2"
                                onClick={() =>
                                  claim(position.id, position.reward)
                                }
                              >
                                Claim
                              </Button>
                              <Button
                                colorScheme="gray"
                                onClick={() =>
                                  exit(position.id, position.reward)
                                }
                              >
                                Exit
                              </Button>
                            </>
                          ) : null}
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              ) : null}
            </Table>
            {!positions[0] && (
              <Center flexDirection="column" p="6">
                <Heading size="sm">No RBN positions found!</Heading>
                <Text>
                  {`Deposit `}
                  <Link isExternal>
                    <b>{`RBN & ETH here`}</b>
                  </Link>
                  {` to get started`}{' '}
                </Text>
              </Center>
            )}
          </Box>
          <FAQs />
        </Flex>
      </Center>
    </Page>
  )
}
