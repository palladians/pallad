import { ClockIcon } from "lucide-react"
import colors from "tailwindcss/colors"

import { TransactionResult } from "../components/transaction-result"

type TransactionSuccessViewProps = {
  hash: string
  onGoToTransactions: () => void
}

export const TransactionSuccessView = ({
  hash,
  onGoToTransactions,
}: TransactionSuccessViewProps) => {
  return (
    <TransactionResult
      title="Transaction submitted"
      result={{
        label: "Pending Transaction Hash",
        content: hash,
      }}
      button={{
        label: "View Transactions",
        onClick: onGoToTransactions,
      }}
    />
  )
}
