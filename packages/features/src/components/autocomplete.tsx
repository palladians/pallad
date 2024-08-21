import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react"
import clsx from "clsx"
import { matchSorter } from "match-sorter"
import { take } from "rambda"
import React from "react"
import type { ClipboardEventHandler } from "react"
import type { UseFormRegisterReturn } from "react-hook-form"

type AutocompleteProps = {
  currentValue: string
  setValue: (newValue: string) => void
  onPaste: ClipboardEventHandler<HTMLInputElement>
  options: string[]
  placeholder?: string
  autoFocus?: boolean
  testId: string
  inputProps: UseFormRegisterReturn
  wordNumber: number
}

export const Autocomplete = ({
  currentValue,
  onPaste,
  options,
  placeholder,
  autoFocus,
  testId,
  inputProps,
  setValue,
  wordNumber,
}: AutocompleteProps) => {
  const filteredOptions = take(3, matchSorter(options, currentValue))
  return (
    <div className="dropdown relative">
      <Combobox value={currentValue} onChange={setValue}>
        <ComboboxInput
          className={clsx(
            "input text-sm w-full bg-[#413E5E] caret-[#eec382]",
            wordNumber > 9 ? "pl-8" : "pl-5"
          )}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onPaste={onPaste}
          autoComplete="off"
          data-testid={testId}
          {...inputProps}
          style={{ position: "relative" }}
        />
        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#afd9e2] pointer-events-none">
          {wordNumber}.
        </span>
        <ComboboxOptions
          className={clsx(
            "dropdown-content z-10 menu shadow p-2 bg-secondary rounded-box w-28 empty:invisible",
          )}
        >
          {filteredOptions.map((option) => (
            <ComboboxOption
              key={option}
              value={option}
              className={clsx("btn btn-sm rounded-sm data-[focus]:btn-neutral")}
            >
              {option}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  )
}
