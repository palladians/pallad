import type { StoryDefault } from "@ladle/react"

import { useForm } from "react-hook-form"
import { TransactionSummaryView } from "./transaction-summary"

export const View = () => {
  const confirmationForm = useForm<{ spendingPassword: string }>()
  return (
    <TransactionSummaryView
      transaction={{
        amount: 25,
        fee: 0.1,
        from: "B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS",
        to: "B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS",
        kind: "transaction",
        total: 25.1,
      }}
      confirmationForm={confirmationForm}
      submitTransaction={(data: any) => console.log(data)}
    />
  )
}

export default {
  title: "Send / Transaction Summary",
} satisfies StoryDefault
