import React from 'react'
import {
  Flex,
  Box,
  Image,
  Link,
  Icon,
  useColorModeValue,
  chakra
} from '@chakra-ui/react'
import {
  CheckCircleIcon,
  WarningTwoIcon,
  TimeIcon,
  IoMdCheckmarkCircle
} from '@chakra-ui/icons'

import useAlerts from '../../contexts/useAlerts'

function Alerts() {
  const { alerts } = useAlerts()
  return (
    <Box
      position="fixed"
      bottom="60px"
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
                bg={'white'}
                shadow="md"
                rounded="lg"
                overflow="hidden"
                mt="10px"
                key={item.text}
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
                    <chakra.span color={'blue.500'} fontWeight="bold">
                      Pending
                    </chakra.span>
                    <chakra.p color={'gray.600'} fontSize="sm">
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
                bg={'white'}
                shadow="md"
                rounded="lg"
                overflow="hidden"
                mt="10px"
                key={item.text}
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
                    <chakra.span color={'green.500'} fontWeight="bold">
                      Success
                    </chakra.span>
                    <chakra.p color={'gray.600'} fontSize="sm">
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
                bg={'white'}
                shadow="md"
                rounded="lg"
                overflow="hidden"
                mt="10px"
                key={item.text}
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
                    <chakra.span color={'red.500'} fontWeight="bold">
                      Error
                    </chakra.span>
                    <chakra.p color={'gray.600'} fontSize="sm">
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
