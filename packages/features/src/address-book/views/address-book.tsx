import { PlusIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useAddressBookStore } from '@/common/store/address-book'
import { AppLayout } from '@/components/app-layout'
import { ViewHeading } from '@/components/view-heading'

import { ContactTile } from '../components/contact-tile'

const DonatePallad = {
  name: 'Donate To Pallad',
  address: 'B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS'
}

export const AddressBookView = () => {
  const navigate = useNavigate()
  const contacts = useAddressBookStore((state) => state.contacts)
  return (
    <AppLayout>
      <div className="flex flex-col flex-1">
        <ViewHeading
          title="Address Book"
          button={{
            label: (
              <div className="flex justify-center items-center gap-2">
                <PlusIcon size={14} />
                Add Address
              </div>
            ),
            onClick: () => navigate('/contacts/new'),
            testId: 'addressBook__addAddressButton'
          }}
        />
        <div className="flex flex-col gap-2 p-4">
          <ContactTile
            contact={{
              name: DonatePallad.name,
              address: DonatePallad.address
            }}
          />
          {contacts.map((contact, i) => (
            <ContactTile key={i} contact={contact} index={i} />
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
