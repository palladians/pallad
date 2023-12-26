import { TrashIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { truncateString } from '@/common/lib/string'
import { useAddressBookStore } from '@/common/store/address-book'
import { Contact } from '@/common/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'

interface ContactTileProps {
  contact: Contact
  index?: number
}

export const ContactTile = ({ contact, index }: ContactTileProps) => {
  const navigate = useNavigate()
  const removeContact = useAddressBookStore((state) => state.removeContact)
  return (
    <Card
      className="flex items-center justify-between p-1"
      data-testid="addressBook__contact"
    >
      <div className="flex items-center justify-center">
        <Button
          variant="link"
          className="text-sky-400"
          onClick={() =>
            navigate('/send', { state: { address: contact.address } })
          }
          data-testid="addressBook__contactName"
        >
          <Badge variant="secondary">{contact.name}</Badge>
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-sm break-keep truncate pr-2">
          {contact?.address &&
            truncateString({
              value: contact.address,
              firstCharCount: 4,
              endCharCount: 4
            })}
        </p>
        {typeof index === 'number' && (
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="link"
                size="icon"
                onClick={() => removeContact({ index })}
                data-testid="addressBook__removeAddress"
              >
                <TrashIcon size={16} className="text-sky-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remove Contact</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </Card>
  )
}
