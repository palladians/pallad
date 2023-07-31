import { Avatar, AvatarFallback, Button, Card } from '@palladxyz/ui'
import { TrashIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

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
    <Card className="flex items-center justify-between p-2">
      <div className="flex items-center justify-center">
        <Avatar>
          <AvatarFallback>{contact.name?.[0]}</AvatarFallback>
        </Avatar>
        <Button
          variant="link"
          className="text-sky-400"
          onClick={() =>
            navigate('/send', { state: { address: contact.address } })
          }
        >
          {contact.name}
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-sm break-keep truncate">
          {contact?.address &&
            truncateString({
              value: contact.address,
              firstCharCount: 4,
              endCharCount: 4
            })}
        </p>
        {typeof index === 'number' && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => removeContact({ index })}
          >
            <TrashIcon size={16} className="text-sky-500" />
          </Button>
        )}
      </div>
    </Card>
  )
}
