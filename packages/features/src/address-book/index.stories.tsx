import { type StoryDefault, action } from "@ladle/react"

import type { Contact } from "@/common/types"
import { AddressBookView } from "./views/address-book"
import { NewAddressView } from "./views/new-address"

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

export const AddressBook = () => (
  <AddressBookView
    contacts={Contacts}
    removeContact={action("Remove Contact")}
  />
)

export const NewAddress = () => (
  <NewAddressView onGoBack={() => console.log("back")} onSubmit={console.log} />
)

export default {
  title: "Address Book",
} satisfies StoryDefault
