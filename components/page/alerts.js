import React from 'react'
import {
  Flex,
  Box,
  Image,
  Link,
  Icon,
  useColorModeValue,
  chakra,
} from '@chakra-ui/react'
import {
  CheckCircleIcon,
  WarningTwoIcon,
  TimeIcon,
  IoMdCheckmarkCircle,
} from '@chakra-ui/icons'

import useAlerts from '../../contexts/useAlerts'

const Alerts = () => {
  const { alerts } = useAlerts()
  return (
    <Box
      position="fixed"
      bottom="130"
      right={['10', '0']}
      p="10px 30px"
      zIndex="10"
      minWidth="300px"
    >
      {alerts.reverse().map((item, i) => {
        switch (item.type) {
          case 'pending':
            return (
              <Flex
                maxW="sm"
                w="full"
                mx="auto"
                bg={useColorModeValue('white', 'gray.800')}
                shadow="md"
                rounded="lg"
                overflow="hidden"
                mt="10px"
              >
                <Flex
                  justifyContent="center"
                  alignItems="center"
                  w={12}
                  bg="blue.500"
                >
                  <Icon as={TimeIcon} color="white" boxSize={6} />
                </Flex>

                <Box mx={-3} py={2} px={4}>
                  <Box mx={3}>
                    <chakra.span
                      color={useColorModeValue('blue.500', 'blue.400')}
                      fontWeight="bold"
                    >
                      Info
                    </chakra.span>
                    <chakra.p
                      color={useColorModeValue('gray.600', 'gray.200')}
                      fontSize="sm"
                    >
                      {item.text}
                    </chakra.p>
                  </Box>
                </Box>
              </Flex>
            )
            break
          case 'success':
            return (
              <Flex
                maxW="sm"
                w="full"
                mx="auto"
                bg={useColorModeValue('white', 'gray.800')}
                shadow="md"
                rounded="lg"
                overflow="hidden"
                mt="10px"
              >
                <Flex
                  justifyContent="center"
                  alignItems="center"
                  w={12}
                  bg="green.500"
                >
                  <Icon as={CheckCircleIcon} color="white" boxSize={6} />
                </Flex>

                <Box mx={-3} py={2} px={4}>
                  <Box mx={3}>
                    <chakra.span
                      color={useColorModeValue('green.500', 'green.400')}
                      fontWeight="bold"
                    >
                      Success
                    </chakra.span>
                    <chakra.p
                      color={useColorModeValue('gray.600', 'gray.200')}
                      fontSize="sm"
                    >
                      {item.text}!
                    </chakra.p>
                  </Box>
                </Box>
              </Flex>
            )
            break
          case 'fail':
            return (
              <Flex
                maxW="sm"
                w="full"
                mx="auto"
                bg={useColorModeValue('white', 'gray.800')}
                shadow="md"
                rounded="lg"
                overflow="hidden"
                mt="10px"
              >
                <Flex
                  justifyContent="center"
                  alignItems="center"
                  w={12}
                  bg="red.500"
                >
                  <Icon as={WarningTwoIcon} color="white" boxSize={6} />
                </Flex>

                <Box mx={-3} py={2} px={4}>
                  <Box mx={3}>
                    <chakra.span
                      color={useColorModeValue('red.500', 'red.400')}
                      fontWeight="bold"
                    >
                      Error
                    </chakra.span>
                    <chakra.p
                      color={useColorModeValue('gray.600', 'gray.200')}
                      fontSize="sm"
                    >
                      {item.text}!
                    </chakra.p>
                  </Box>
                </Box>
              </Flex>
            )
            break
          default:
            return
            break
        }
      })}
    </Box>
  )
}

export default Alerts
