import { AppLayout } from "@/components/app-layout"

import { TransactionResult } from "../components/transaction-result"

type TransactionErrorViewProps = {
  onGoBack: () => void
}

export const TransactionErrorView = ({
  onGoBack,
}: TransactionErrorViewProps) => {
  return (
    <AppLayout>
      <TransactionResult
        title="Submission Error"
        result={{
          label: "Transaction Failed",
          content: "Error: 500 Broadcast API not reachable",
        }}
        button={{
          label: "Try Again",
          onClick: onGoBack,
        }}
      />
    </AppLayout>
  )
}
