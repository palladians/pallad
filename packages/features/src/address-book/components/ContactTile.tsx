import { Box, Button, Card, Icons, Text, theme } from '@palladxyz/ui'
import { Pressable } from 'react-native'
import { useNavigate } from 'react-router-native'

import { truncateString } from '../../common/lib/string'
import { Contact } from '../../common/types'
import { useAddressBookStore } from '../../wallet/store/addressBook'

interface ContactTileProps {
  contact: Contact
  index?: number
}

export const ContactTile = ({ contact, index }: ContactTileProps) => {
  const navigate = useNavigate()
  const removeContact = useAddressBookStore((state) => state.removeContact)
  return (
    <Card
      css={{
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: '$md'
      }}
    >
      <Button
        variant="link"
        css={{ padding: 0, width: 'auto', height: 'auto' }}
        onPress={() =>
          navigate('/send', { state: { address: contact.address } })
        }
      >
        {contact.name}
      </Button>
      <Box css={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text css={{ fontSize: 14 }}>
          {contact?.address &&
            truncateString({
              value: contact.address,
              firstCharCount: 8,
              endCharCount: 8
            })}
        </Text>
        {typeof index === 'number' && (
          <Pressable onPress={() => removeContact({ index })}>
            <Icons.Trash size={20} color={theme.colors.primary500.value} />
          </Pressable>
        )}
      </Box>
    </Card>
  )
}
