import { Box, Flex, HStack, Link, Text, chakra } from '@chakra-ui/react'
import React from 'react'
import useWeb3 from '../../contexts/useWeb3'

const links = [
  {
    label: 'github',
    href: 'https://github.com/l3wi/univ3-staking',
    isExternal: true
  },
  {
    label: 'lewi',
    href: 'https://twitter.com/lewifree',
    isExternal: true
  }
]

const Footer = () => {
  const { block } = useWeb3()
  return (
    <Box as="footer">
      <Flex
        py={8}
        flexDirection={['column', 'column', 'row']}
        justifyContent="space-between"
        alignItems="center"
        as="footer"
      >
        <Box textAlign={['center', 'center', 'initial']}>
          <Text fontWeight="bold" fontSize="md">
            staker.projects.sh
          </Text>
          <Text fontSize="sm" color="gray.500">
            A simple UI for Ribbon (RBN) staking
          </Text>
        </Box>
        <Box>
          <HStack spacing={4}>
            <Link
              py={1}
              isExternal
              href="https://etherscan.io/blocks"
              fontSize="sm"
              display="ruby"
              _hover={{
                color: 'orange.600'
              }}
            >
              <chakra.span
                display="block"
                h="10px"
                w="10px"
                bg="green.600"
                rounded="full"
              />{' '}
              {block}
            </Link>
            {links.map(({ href, isExternal, label }) => (
              <Link
                py={1}
                key={label}
                href={href}
                fontSize="sm"
                isExternal={isExternal}
                rel="noopener noreferrer"
                _hover={{
                  color: 'orange.600'
                }}
              >
                {label}
              </Link>
            ))}
          </HStack>
          {/* <Text fontSize="xs" color="gray.500">
            
          </Text> */}
        </Box>
      </Flex>
    </Box>
  )
}

export default Footer
