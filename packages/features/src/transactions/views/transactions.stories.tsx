import type { StoryDefault } from "@ladle/react"

import { TransactionsView } from "./transactions"

export const View = () => {
  return (
    <TransactionsView
      loading={false}
      onGoBack={() => console.log("go back")}
      onlyPendingTransactions={[]}
      transactions={[]}
    />
  )
}

export default {
  title: "Transactions / Index",
} satisfies StoryDefault
