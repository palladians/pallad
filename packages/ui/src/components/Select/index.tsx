import React, { useEffect, useMemo, useState } from 'react'
import { Pressable, View } from 'react-native'
import { Popover } from 'react-native-popper'

import { iconChevronDown } from '../../assets/icons'
import { styled } from '../../lib/styled'
import { Button } from '../Button'
import { Image } from '../Image'
import { Text } from '../Text'
import { selectContentBase, selectTriggerBase } from './index.css'

export const SelectTrigger = styled(Pressable, selectTriggerBase)
export const SelectContent = styled(View, selectContentBase)

type Option = { value: string; label: string; defaultSelected?: boolean }

interface SelectProps {
  options?: Option[]
  placeholder?: string
}

export const Select = ({ options, placeholder }: SelectProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [value, setValue] = useState<string | null>(null)
  const currentLabel = useMemo(
    () => options.find((option) => option.value === value)?.label,
    [value]
  )
  const setNewValue = (value: string) => {
    setValue(value)
    setIsOpen(false)
  }
  useEffect(() => {
    const nextSelected = options.find((option) => option.defaultSelected)
    setValue(nextSelected.value)
  }, [options])
  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      on="press"
      trigger={
        <SelectTrigger>
          <Text css={{ fontSize: 14 }}>{currentLabel || placeholder}</Text>
          <Image
            source={iconChevronDown}
            css={{
              width: 24,
              height: 24,
              position: 'absolute',
              right: 8,
              top: 8
            }}
          />
        </SelectTrigger>
      }
      placement="bottom"
      shouldCloseOnOutsideClick
    >
      <Popover.Backdrop />
      <Popover.Content>
        <SelectContent>
          {options?.map((option) => (
            <Button
              key={option.value}
              variant="secondary"
              onPress={() => setNewValue(option.value)}
              css={{ maxWidth: 256, width: '100%', alignItems: 'flex-start' }}
            >
              {option.label}
            </Button>
          ))}
        </SelectContent>
      </Popover.Content>
    </Popover>
  )
}
