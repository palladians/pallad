import type { Contact } from "@/common/types"
import { AppLayout } from "@/components/app-layout"

import { truncateString } from "@/common/lib/string"
import { MenuBar } from "@/components/menu-bar"
import { Copy, Plus } from "lucide-react"
import type { MouseEvent } from "react"
import { Link } from "react-router-dom"

type AddressBookViewProps = {
  contacts: Contact[]
  onLogoClicked: () => void
}

export const AddressBookView = ({
  contacts,
  onLogoClicked,
}: AddressBookViewProps) => {
  const onAddressCopy = (
    event: MouseEvent<HTMLButtonElement>,
    address: string,
  ) => {
    event.preventDefault()
    navigator.clipboard.writeText(address)
  }
  return (
    <AppLayout>
      <div className="pb-12 bg-secondary rounded-b-2xl">
        <MenuBar variant="dashboard" onLogoClicked={onLogoClicked} />
        <h2 className="ml-8 mt-1 text-3xl">Address book</h2>
      </div>
      <div className="py-6 px-8 space-y-2">
        <Link to="/contacts/new" className="flex btn text-base font-medium">
          <Plus width={16} height={16} className="text-[#F6C177]" />
          <p>Add new contact</p>
        </Link>
        <div className="space-y-2">
          {contacts.map((contact, index) => {
            return (
              <Link
                // biome-ignore lint/suspicious/noArrayIndexKey: won't update
                key={index}
                to={`/contacts/${index}`}
                className="px-6 flex justify-between btn text-base font-medium overflow-x-auto group"
              >
                <p>{contact.name}</p>
                <div className="flex items-center space-x-4 translate-x-10 group-hover:translate-x-0 transition-transform">
                  <p>
                    {truncateString({
                      value: contact.address,
                      firstCharCount: 4,
                      endCharCount: 4,
                    })}
                  </p>
                  <button
                    type="button"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(event) => onAddressCopy(event, contact.address)}
                  >
                    <Copy width={24} height={24} className="text-[#F6C177]" />
                  </button>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}
