import React from 'react'
import {
  Animated,
  Modal as NativeModal,
  Pressable,
  TouchableWithoutFeedback
} from 'react-native'

import { iconX } from '../../assets/icons'
import { BoxProps, composeBox } from '../Box'
import { IconButton } from '../IconButton'
import { Image } from '../Image'

interface ModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  children: React.ReactNode
  maxHeight?: string | number
  borderRadius?: string | number
  contentProps?: BoxProps
  containerProps?: BoxProps
}

export const Modal = ({
  isOpen = false,
  setIsOpen,
  children,
  maxHeight = 480,
  borderRadius = '$md',
  contentProps,
  containerProps
}: ModalProps) => {
  const StyledView = composeBox({ baseComponent: Animated.View })
  const StyledPressable = composeBox({ baseComponent: Pressable })
  const StyledTouchableWithoutFeedback = composeBox({
    baseComponent: TouchableWithoutFeedback
  })
  return (
    <NativeModal
      transparent
      visible={isOpen}
      animationType="fade"
      {...containerProps}
    >
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
              ...contentProps?.css,
              position: 'relative',
              maxWidth: 600,
              width: '100%',
              maxHeight,
              height: '100%',
              backgroundColor: '$white',
              margin: 'auto',
              borderRadius,
              padding: '$md'
            }}
            {...contentProps}
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
    </NativeModal>
  )
}
