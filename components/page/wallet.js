import React, { useContext } from 'react'
import { Text, Button, Box, useColorModeValue } from '@chakra-ui/react'
import CancelButton from './cancel'
import { useWeb3 } from '../../contexts/useWeb3'

export default function UserAddress() {
  const {
    web3,
    account,
    balance,
    status,
    disconnectWallet,
    connectWallet,
  } = useWeb3()

  const buttonBgColor = useColorModeValue('white', 'gray.700')

  return (
    <>
      <Button
        onClick={() => connectWallet()}
        background={buttonBgColor}
        variant="muted"
        boxShadow="md"
        borderRadius="lg"
      >
        <Text fontSize="sm" color="gray.500" mr={2}>
          {account ? `${balance.toFixed(2)} ETH` : 'Connect Wallet'}
        </Text>
        {account && (
          <>
            <Text fontSize="sm" mr={4}>
              {account.substring(0, 6) +
                '...' +
                account.substring(account.length - 4)}
            </Text>
          </>
        )}
        <Box
          background={account ? 'green.400' : 'gray.400'}
          borderRadius="100%"
          width={3}
          height={3}
        />
        {account && (
          <CancelButton
            margin={{ marginLeft: '8px' }}
            width="14px"
            height="14px"
            handleClick={() => disconnectWallet()}
          />
        )}
      </Button>
    </>
  )
}
