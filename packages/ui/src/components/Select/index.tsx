import { Popover } from 'react-native-popper'
import { styled } from '../../lib/styled'
import { selectContentBase, selectTriggerBase } from './index.css'
import { Text, View } from 'react-native'
import { useEffect, useState } from 'react'
import { Button } from '../Button'

export const SelectTrigger = styled(Text, selectTriggerBase)
export const SelectContent = styled(View, selectContentBase)

type Option = { value: string; label: string; defaultSelected?: boolean }

interface SelectProps {
  options?: Option[]
  placeholder?: string
}

export const Select = ({ options, placeholder }: SelectProps) => {
  const [value, setValue] = useState<string | null>(null)
  useEffect(() => {
    const nextSelected = options.find((option) => option.defaultSelected)
    setValue(nextSelected.value)
  }, [options])
  return (
    <Popover
      on="press"
      trigger={<SelectTrigger>{value || placeholder}</SelectTrigger>}
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
              onPress={() => setValue(option.value)}
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
