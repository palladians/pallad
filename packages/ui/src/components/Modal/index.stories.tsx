import { StoryDefault } from '@ladle/react'
import React from 'react'
import { Text } from 'react-native'

import { useDisclosure } from '../../utils/useDisclosure'
import { Box } from '../Box'
import { Button } from '../Button'
import { Heading } from '../Heading'
import { Modal } from '.'

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
