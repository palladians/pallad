import { Ellipsis, X } from "lucide-react"
import { useState } from "react"

type DropdownOption = {
  name: string
  icon: JSX.Element
  onClick: () => void
}

type DetailsDropdownProps = {
  options: DropdownOption[]
}

export const DetailsDropdown = ({ options }: DetailsDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        className="btn btn-circle bg-white min-h-10 h-10 w-10 border-none outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X width={24} height={24} color={"#191725"} />
        ) : (
          <Ellipsis width={24} height={24} color={"#191725"} />
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-secondary rounded-lg shadow-lg z-10">
          <ul className="py-2 text-sm">
            {options.map((option, index) => (
              <li key={`${option.name}`}>
                <button
                  type="button"
                  onClick={() => {
                    option.onClick()
                    setIsOpen(false)
                  }}
                  className="flex justify-between items-center px-4 py-2 w-full text-left hover:bg-accent"
                >
                  {option.name}
                  {option.icon}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
