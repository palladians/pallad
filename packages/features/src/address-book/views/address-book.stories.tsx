import type { StoryDefault } from "@ladle/react"

import type { Contact } from "@/common/types"
import { AddressBookView } from "./address-book"

const Contacts: Contact[] = [
  {
    name: "Bob",
    address: "B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS",
  },
  {
    name: "John",
    address: "B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS",
  },
]

export const View = () => <AddressBookView contacts={Contacts} />

export default {
  title: "Address Book",
} satisfies StoryDefault
