import React, { useEffect, useState } from 'react'
import { Pressable } from 'react-native'

import { iconCircle } from '../../assets/icons'
import { styled } from '../../lib/styled'
import { Box } from '../Box'
import { Image } from '../Image'
import { Text } from '../Text'
import { radioButtonBase } from './index.css'

const RadioButton = styled(Pressable, radioButtonBase)

type Option = { value: string; label: string; defaultSelected?: boolean }

interface RadioGroupProps {
  options: Option[]
  onChange: (newValue: string) => void
}

export const RadioGroup = ({ options, onChange }: RadioGroupProps) => {
  const [value, setValue] = useState<string | null>(null)
  useEffect(() => {
    const nextSelected = options.find((option) => option.defaultSelected)
    nextSelected?.value && setValue(nextSelected?.value)
  }, [options])
  useEffect(() => {
    if (!value) return
    onChange(value)
  }, [value])
  return (
    <Box css={{ gap: 12 }}>
      {options.map((option) => (
        <Box
          key={option.value}
          css={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}
        >
          <RadioButton onPress={() => setValue(option.value)}>
            {value === option.value && (
              <Image
                source={iconCircle as any}
                css={{ width: 16, height: 16 }}
              />
            )}
          </RadioButton>
          <Pressable onPress={() => setValue(option.value)}>
            <Text>{option.label}</Text>
          </Pressable>
        </Box>
      ))}
    </Box>
  )
}
