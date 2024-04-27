import { Combobox } from "@headlessui/react"
import { matchSorter } from "match-sorter"
import { take } from "rambda"
import { useState } from "react"

type AutocompleteProps = {
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  autoFocus?: boolean
}

export const Autocomplete = ({
  value,
  onChange,
  options,
  placeholder,
  autoFocus,
  ...rest
}: AutocompleteProps) => {
  const [query, setQuery] = useState("")
  const filteredOptions = take(3, matchSorter(options, query))
  return (
    <div className="dropdown" {...rest}>
      <Combobox value={value} onChange={onChange}>
        <Combobox.Input
          className="input"
          placeholder=""
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoFocus={autoFocus}
        />
        <Combobox.Options className="dropdown-content">
          {filteredOptions.map((option) => (
            <Combobox.Option key={option} value={option}>
              {option}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox>
    </div>
  )
}
