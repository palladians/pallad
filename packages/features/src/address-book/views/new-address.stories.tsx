import type { StoryDefault } from "@ladle/react"

import { NewAddressView } from "./new-address"

export const View = () => (
  <NewAddressView onGoBack={() => console.log("back")} onSubmit={console.log} />
)

export default {
  title: "Address Book / New Address",
} satisfies StoryDefault
