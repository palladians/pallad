import type { StoryDefault } from "@ladle/react"

import { AddressBookView } from "./address-book"

export const View = () => (
  <AddressBookView contacts={[]} onAddClicked={() => console.log("back")} />
)

export default {
  title: "Address Book / Index",
} satisfies StoryDefault
