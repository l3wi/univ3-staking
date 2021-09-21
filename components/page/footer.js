import { Box, Flex, HStack, Link, Text } from '@chakra-ui/layout'
import React from 'react'

const links = [
  {
    label: 'Code',
    href: '#',
    isExternal: true,
  },
  {
    label: 'Discord',
    href: '#',
    isExternal: true,
  },
  {
    label: 'FAQ',
    href: '#',
    isExternal: true,
  },
  {
    label: 'Governance',
    href: '#',
    isExternal: true,
  },
]

const Footer = () => {
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
            kitchen.sink
          </Text>
          <Text fontSize="sm" color="gray.500">
            A NextJS Web3 Starter Repo
          </Text>
        </Box>
        <Box>
          <HStack spacing={4}>
            {links.map(({ href, isExternal, label }) => (
              <Link
                py={1}
                key={label}
                href={href}
                fontSize="sm"
                isExternal={isExternal}
                rel="noopener noreferrer"
                _hover={{
                  color: 'green.300',
                  borderBottomColor: 'green.300',
                  borderBottomWidth: 1,
                }}
              >
                {label}
              </Link>
            ))}
          </HStack>
        </Box>
      </Flex>
    </Box>
  )
}

export default Footer
