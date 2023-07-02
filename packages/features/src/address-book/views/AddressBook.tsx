import { Box, Button } from '@palladxyz/ui'
import { useNavigate } from 'react-router-native'

import { AppLayout } from '../../common/components/AppLayout'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useAddressBookStore } from '../../common/store/addressBook'
import { ContactTile } from '../components/ContactTile'

const DonatePallad = {
  name: 'Donate Pallad',
  address: 'B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS'
}

export const AddressBookView = () => {
  const navigate = useNavigate()
  const contacts = useAddressBookStore((state) => state.contacts)
  return (
    <AppLayout>
      <Box css={{ padding: '$md', flex: 1, gap: 16 }}>
        <ViewHeading
          title="Address Book"
          backButton={{ onPress: () => navigate(-1) }}
        />
        <Box css={{ gap: 8 }}>
          <ContactTile
            contact={{
              name: DonatePallad.name,
              address: DonatePallad.address
            }}
          />
          {contacts.map((contact, i) => (
            <ContactTile key={i} contact={contact} index={i} />
          ))}
          <Button variant="link" onPress={() => navigate('/contacts/new')}>
            Add New Address
          </Button>
        </Box>
      </Box>
    </AppLayout>
  )
}
