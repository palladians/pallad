import { Combobox } from "@headlessui/react"
import clsx from "clsx"
import { matchSorter } from "match-sorter"
import { take } from "rambda"
import React from "react"
import type { ClipboardEventHandler } from "react"

type AutocompleteProps = {
  value: string
  onChange: (value: string) => void
  onPaste: ClipboardEventHandler<HTMLInputElement>
  options: string[]
  placeholder?: string
  autoFocus?: boolean
  testId: string
}

export const Autocomplete = React.forwardRef(
  (
    {
      value,
      onChange,
      onPaste,
      options,
      placeholder,
      autoFocus,
      testId,
      ...rest
    }: AutocompleteProps,
    ref,
  ) => {
    const filteredOptions = take(3, matchSorter(options, value))
    return (
      <div className="dropdown" {...rest}>
        <Combobox value={value} onChange={onChange}>
          <Combobox.Input
            className="input text-sm w-full bg-[#413E5E]"
            placeholder={placeholder}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            autoFocus={autoFocus}
            onPaste={onPaste}
            autoComplete="off"
            data-testid={testId}
            ref={ref as any}
          />
          <Combobox.Options className="dropdown-content z-10 menu shadow p-2 bg-secondary rounded-box w-28">
            {filteredOptions.map((option) => (
              <Combobox.Option as="li" key={option} value={option}>
                {({ active }) => (
                  <button type="button" className={clsx(active && "active")}>
                    {option}
                  </button>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Combobox>
      </div>
    )
  },
)
