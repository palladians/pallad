import type { StoryDefault } from "@ladle/react"
import { CurrencyView } from "./currency"

export const View = () => (
  <CurrencyView onCloseClicked={() => console.log("Go Back")} />
)

export default {
  title: "Settings / Display / Currency",
} satisfies StoryDefault
