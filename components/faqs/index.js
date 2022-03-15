import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Heading,
  Text,
  ListItem,
  OrderedList,
  UnorderedList,
  Link
} from '@chakra-ui/react'

import { INCENTIVE_KEY } from '../../constants'

const IncentiveKey = INCENTIVE_KEY;

export default function FAQs() {
  return (
    <>
      <Heading ml="4" mt="16" mb="4" size="md">
        Frequently Asked Questions
      </Heading>
      <Accordion w="full" allowToggle>
      <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="600">
                How do I stake my SWIV tokens?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text>{`In order to participate in the rewards program you must provide liquidity to a specific pool and then stake it in the staking contract. `}</Text>
            <br />
            <Text>{`The steps are as follows:`}</Text>
            <OrderedList>
              <ListItem>
                {`Go to the  `}
                <Link
                  href={`https://app.uniswap.org/#/add/ETH/${IncentiveKey[0]}/10000`}
                  isExternal
                >{`Uniswap v3 "Add Liquidity" page for SWIV & USDC.`}</Link>
              </ListItem>
              <ListItem>{`Select a range for your liquidity and supply the tokens.`}</ListItem>
              <ListItem>{`Click "Connect Wallet" and choose a wallet provider.`}</ListItem>
              <ListItem>{`Your LP NFTs will populate in the UI, select "Deposit" to transfer it ot the staking contract`}</ListItem>
              <ListItem>{`Once the token is transfered, you must select "Stake" to start earning rewards.`}</ListItem>
            </OrderedList>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="600">
                What is Liquidity Providing (LP)?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text>{`Liquidity Providing (LP) allows everyone to become a market maker. 
            It's unique to Automated Market Makers (AMMs) like Uniswap & Curve. When you LP you 
            are providing tokens to be used as a counter-party when someone wants to buy or sell a token. `}</Text>
            <br />
            <Text>{`In exchange for providing liquidity, LPs receive fees on each trade. This can 
            be very profitable for LPs on token pairs with high volume. However it can be risky 
            to be an LP as high fluctuations in price may mean that you end up with less value in 
            the long run, even when accounting for trading fees.`}</Text>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="600">
                What is LP staking?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text>{`Alongside trading fees, reward programs may be setup on top of Uniswap V3 to incentivize people to provide liquidity. With Uniswap V3, anyone can participate in these rewards programs by placing the NFT token they receive when providing liquidity into a special contract. `}</Text>
            <br />
            <Text>{`Once in this contract, the NFT will start to accrue rewarded tokens if the liquidity provided is "in-range". "In-range" simply means that the exchange rate (price) of the tokens being swapped falls within the range that the user chose when they provided liquidity. `}</Text>
            <br />
            <Text fontSize="sm">
              <i>{`Note: you can provide liquidity multiple times (accross different ranges) then stake those NFTs in the staker.`}</i>
            </Text>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="600">
                How do I claim my rewards?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text>{`Once you have staked your NFT in the contract, denoted by a green "STAKED" badge in the UI, you will start to see rewards accruing. These rewards remain in the staking contract until you use the "Claim" or "Exit" buttons:`}</Text>
            <br />
            <UnorderedList>
              <ListItem>
                <b>Claim:</b>{' '}
                {`When you click "Claim" you are withdrawing your accumulated rewards to your wallet but your NFT stays within the staking contract, continuing to accrue rewards.`}{' '}
              </ListItem>
              <ListItem>
                <b>Exit:</b>{' '}
                {`When you click "Exit" you are withdrawing your accrued rewards and your NFT to your wallet. You will no longer accrue rewards, but you now can adjust your liquidity or withdraw your liquidity.`}{' '}
              </ListItem>
            </UnorderedList>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="600">
                {`I don't see my Uniswap LP position on the Uniswap website anymore. Why?`}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text>{`When you stake your NFT, your NFT will be temporarily held on the Staker contract. This gives it the ability to earn SWIV rewards for providing liquidity. When you Exit, the NFT will be returned back to your wallet.`}</Text>
            <br/>
            <Text>{`To see details of the position, click the 'Token ID' link on the left-hand side of the position.`}</Text>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="600">
                Is this an official site?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text>{`No, this website is unaffiliated with Swivel or any token project. It was created to help people navigate the somewhat confusing Uniswap V3 Staker design. It is provided for your enjoyment and without any warranties. Be safe and double check your TXs before you send them.`}</Text>
            <br />
            <Text>{`If you'd like to check the source code or host your own site, please check out the Github link in the bottom right. `}</Text>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="600">
                Which pool should I provide liquidity to?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text>{`These liquidity incentives are for liquidity provided to the SWIV/USDC 1% pool.`}</Text>
            <br />
            <Text>{`You can provide liquidity to the pool using the link below.`}</Text>
            <br />
            <Text>
                  {`Deposit `}
                  <Link
                    isExternal
                    href={`https://app.uniswap.org/#/add/ETH/${IncentiveKey[0]}/10000`}
                  >
                    <b>{`SWIV & USDC here`}</b>
                  </Link>
            </Text>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  )
}
