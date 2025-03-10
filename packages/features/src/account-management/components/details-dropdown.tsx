import type { SingleCredentialState } from "@palladxyz/vault"
import { Ellipsis, X } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import type { DropdownOption } from "../types"

type DetailsDropdownProps = {
  options: DropdownOption[]
  account: SingleCredentialState
}

export const DetailsDropdown = ({ options, account }: DetailsDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const { t } = useTranslation()

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
        <div className="absolute right-0 mt-2 w-30 bg-secondary rounded-lg shadow-lg z-10">
          <ul className="p-2 shadow menu dropdown-content border-2 border-secondary z-[1] bg-neutral rounded-box w-40">
            {options.map((option) => (
              <li key={`${option.name}`}>
                <button
                  type="button"
                  onClick={() => {
                    if (account) {
                      option.onClick(account)
                      setIsOpen(false)
                    }
                  }}
                  className="flex justify-between items-center px-4 py-2 w-full text-left"
                >
                  <span>{t(option.name)}</span>
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
