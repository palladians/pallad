import { matchSorter } from 'match-sorter'
import { take } from 'rambda'
import * as React from 'react'
import { useState } from 'react'

import { Command, CommandItem, CommandList } from '@/components/ui/command'

import { Input, InputProps } from './ui/input'

type AutocompleteRef = HTMLInputElement
type AutocompleteProps = InputProps & {
  setValue: (value: string) => void
  options: string[]
  onEnterPressed?: () => void
}

export const Autocomplete = React.forwardRef<
  AutocompleteRef,
  AutocompleteProps
>(
  (
    {
      value,
      onBlur,
      onFocus,
      setValue,
      options,
      onChange,
      onEnterPressed,
      ...rest
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)
    const [internalValue, setInternalValue] = useState<string>(
      value?.toString() || ''
    )
    const extendedChange: React.ChangeEventHandler<HTMLInputElement> = (
      event
    ) => {
      setOpen(true)
      setInternalValue(event.target.value)
      onChange?.(event)
      return event
    }
    const extendedBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
      onBlur?.(event)
      setTimeout(() => setOpen(false), 100)
      return event
    }
    const extendedFocus: React.FocusEventHandler<HTMLInputElement> = (
      event
    ) => {
      onFocus?.(event)
      setOpen(true)
      return event
    }
    const filteredOptions = take(3, matchSorter(options, internalValue))
    const extendedSelect = (value: string) => {
      setOpen(false)
      return setValue(value)
    }
    const extendedKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
      event
    ) => {
      if (event.key === 'Escape') setOpen(false)
      if (event.key === 'Enter') onEnterPressed?.()
      return event
    }
    return (
      <Command className="relative overflow-visible">
        <Input
          value={value?.toString()}
          onBlur={extendedBlur}
          onFocus={extendedFocus}
          onChange={extendedChange}
          onKeyDown={extendedKeyDown}
          {...rest}
          autoComplete="off"
          ref={ref}
        />
        {open && internalValue.length > 0 && filteredOptions.length > 0 && (
          <CommandList
            role="tooltip"
            className="absolute w-[6.75rem] z-10 top-12 bg-background border rounded-[1rem] p-1"
          >
            {filteredOptions.map((option: string) => (
              <CommandItem
                key={option}
                onSelect={extendedSelect}
                value={option}
              >
                {option}
              </CommandItem>
            ))}
          </CommandList>
        )}
      </Command>
    )
  }
)
