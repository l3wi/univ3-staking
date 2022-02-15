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
import parse from 'react-html-parser'
import { FAQ } from '../../config'

export default function FAQs() {
  return (
    <>
      <Heading ml="4" mt="16" mb="4" size="md">
        Frequently Asked Questions
      </Heading>
      <Accordion w="full" allowToggle>
        {FAQ.map((item, i) => (
          <AccordionItem key={`faq-${i}`}>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="600">
                  {item.title}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Text>{parse(item.text)}</Text>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  )
}
