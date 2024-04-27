import type { StoryDefault } from "@ladle/react"

import { TransactionErrorView } from "./transaction-error"

export const View = () => (
  <TransactionErrorView onGoBack={() => console.log("go back")} />
)

export default {
  title: "Dashboard / Send / Error",
} satisfies StoryDefault
