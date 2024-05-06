import { useAddressBookStore } from "@/common/store/address-book"

import { AddressBookView } from "../views/address-book"

export const AddressBookRoute = () => {
  const contacts = useAddressBookStore((state) => state.contacts)
  const removeContact = useAddressBookStore((state) => state.removeContact)
  return <AddressBookView contacts={contacts} removeContact={removeContact} />
}
