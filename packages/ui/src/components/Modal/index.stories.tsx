import React from 'react'
import { Modal } from '.'
import { StoryDefault } from '@ladle/react'
import { Box } from '../Box'
import { Button } from '../Button'
import { useDisclosure } from '../../utils/useDisclosure'
import { Text } from 'react-native'
import {Heading} from "../Heading";

export const Basic = () => {
  const { isOpen, onOpen, setIsOpen } = useDisclosure()
  return (
    <Box>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <Heading size="md">Modal example</Heading>
      </Modal>
      <Button onPress={onOpen}>Open</Button>
    </Box>
  )
}

export default {
  title: 'Modal'
} satisfies StoryDefault
