import { action } from "@ladle/react"
import type { Story, StoryDefault } from "@ladle/react"
import { useForm } from "react-hook-form"

import { SendView } from "./views/send"
import { TransactionErrorView } from "./views/transaction-error"
import { TransactionSuccessView } from "./views/transaction-success"
import { TransactionSummaryView } from "./views/transaction-summary"

export const Send: Story<{ advanced: boolean }> = ({ advanced }) => (
  <SendView
    onGoBack={action("Go Back")}
    balance={300000000000}
    fiatPrice={1.5}
    advanced={advanced}
    setAdvanced={action("Set Advanced")}
  />
)

export const TransactionError = () => (
  <TransactionErrorView onGoBack={action("go back")} />
)

export const TransactionSuccess = () => (
  <TransactionSuccessView
    hash="ASDF1234ASDF1234ASDF1234ASDF1234ASDF1234ASDF1234ASDF1234"
    onGoToTransactions={() => console.log("txs")}
  />
)

export const Summary = () => {
  const confirmationForm = useForm<{ spendingPassword: string }>()
  return (
    <TransactionSummaryView
      transaction={{
        amount: 25,
        fee: 0.1,
        from: "B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS",
        to: "B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS",
        type: "transaction",
        total: 25.1,
      }}
      confirmationForm={confirmationForm}
      onClose={action("On Close")}
      onGoBack={action("Go Back")}
      submitTransaction={(data: any) => console.log(data)}
    />
  )
}

export default {
  title: "Send",
  args: {
    advanced: true,
  },
} satisfies StoryDefault
