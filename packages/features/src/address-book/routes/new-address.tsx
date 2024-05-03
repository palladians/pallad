import { useNavigate } from "react-router-dom"

import { useAddressBookStore } from "@/common/store/address-book"
import { NewAddressView } from "../views/new-address"

export const NewAddressRoute = () => {
  const navigate = useNavigate()
  const addContact = useAddressBookStore((state) => state.addContact)
  return (
    <NewAddressView
      onGoBack={() => navigate(-1)}
      onSubmit={(contact) => {
        addContact(contact)
        navigate("/contacts")
      }}
    />
  )
}
