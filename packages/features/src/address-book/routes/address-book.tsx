import { useAddressBookStore } from "@/common/store/address-book"

import { useNavigate } from "react-router-dom"
import { AddressBookView } from "../views/address-book"

export const AddressBookRoute = () => {
  const navigate = useNavigate()
  const contacts = useAddressBookStore((state) => state.contacts)
  return (
    <AddressBookView
      contacts={contacts}
      goToDashboard={() => navigate("/dashboard")}
    />
  )
}
