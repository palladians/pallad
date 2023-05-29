import React from 'react'
import { Modal as StyledModal, View, TouchableWithoutFeedback, Pressable } from 'react-native'
import { composeBox } from '../Box'
import { Image } from '../Image'
import { IconButton } from '../IconButton'
import { iconX } from '../../assets/icons'

interface ModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  children: React.ReactNode
}

export const Modal = ({ isOpen = false, setIsOpen, children, ...props }: ModalProps) => {
  const StyledView = composeBox({ baseComponent: View })
  const StyledPressable = composeBox({ baseComponent: Pressable })
  const StyledTouchableWithoutFeedback = composeBox({ baseComponent: TouchableWithoutFeedback })
  return (
    <StyledModal transparent visible={isOpen} {...props}>
      <StyledPressable
        css={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.2)'
        }}
        onPress={() => setIsOpen(false)}
      >
        <StyledTouchableWithoutFeedback>
          <StyledView
            css={{
              position: 'relative',
              maxWidth: 600,
              width: '100%',
              maxHeight: 480,
              height: '100%',
              backgroundColor: '$white',
              margin: 'auto',
              borderRadius: '$md',
              padding: '$md'
            }}
          >
            <>
              <IconButton
                icon={<Image source={iconX} css={{ width: 16, height: 16 }} />}
                css={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}
                onPress={() => setIsOpen(false)}
                dataSet={{ hotkey: 'esc' }}
              />
              {children}
            </>
          </StyledView>
        </StyledTouchableWithoutFeedback>
      </StyledPressable>
    </StyledModal>
  )
}
