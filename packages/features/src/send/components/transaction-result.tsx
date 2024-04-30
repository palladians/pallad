import type { ElementType } from "react"

import { MetaField } from "@/components/meta-field"

type TxResult = {
  icon: ElementType
  iconColor: string
  label: string
  content: string
}

type TxButton = {
  label: string
  onClick: () => void
}

interface TransactionResultProps {
  title: string
  result: TxResult
  button: TxButton
}

export const TransactionResult = ({
  title,
  result,
  button,
}: TransactionResultProps) => {
  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-1 justify-center items-center gap-4 p-4">
        <result.icon size={56} color={result.iconColor} />
        <MetaField label={result.label} value={result.content} />
      </div>
      <div className="flex flex-col p-4">
        <button
          type="button"
          onClick={button.onClick}
          data-testid="transactionResult__nextButton"
        >
          {button.label}
        </button>
      </div>
    </div>
  )
}
