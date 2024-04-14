import { useNavigate } from 'react-router-dom'

import { useAddressBookStore } from '@/common/store/address-book'

import { AddressBookView } from '../views/address-book'

export const AddressBookRoute = () => {
  const navigate = useNavigate()
  const contacts = useAddressBookStore((state) => state.contacts)
  return (
    <AddressBookView
      contacts={contacts}
      onAddClicked={() => navigate('/contacts/new')}
    />
  )
}
