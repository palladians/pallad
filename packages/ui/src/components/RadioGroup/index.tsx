import { Box } from '../Box'
import { styled } from '../../lib/styled'
import { Pressable } from 'react-native'
import { radioButtonBase } from './index.css'
import { Image } from '../Image'
import { iconCircle } from '../../assets/icons'
import { Text } from '../Text'
import React, { useEffect, useState } from 'react'

const RadioButton = styled(Pressable, radioButtonBase)

type Option = { value: string; label: string; defaultSelected?: boolean }

interface RadioGroupProps {
  options: Option[]
}

export const RadioGroup = ({ options }: RadioGroupProps) => {
  const [value, setValue] = useState<string | null>(null)
  useEffect(() => {
    const nextSelected = options.find((option) => option.defaultSelected)
    setValue(nextSelected.value)
  }, [options])
  return (
    <Box css={{ gap: 12 }}>
      {options.map((option) => (
        <Box css={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <RadioButton onPress={() => setValue(option.value)}>
            {value === option.value && <Image source={iconCircle} css={{ width: 16, height: 16 }} />}
          </RadioButton>
          <Pressable onPress={() => setValue(option.value)}>
            <Text>{option.label}</Text>
          </Pressable>
        </Box>
      ))}
    </Box>
  )
}
