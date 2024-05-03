import type { Contact } from "@/common/types"
import { AppLayout } from "@/components/app-layout"

import { truncateString } from "@/common/lib/string"
import { MenuBar } from "@/components/menu-bar"
import { Plus } from "lucide-react"
import { Link } from "react-router-dom"

type AddressBookViewProps = {
  contacts: Contact[]
  goToDashboard: () => void
}

export const AddressBookView = ({
  contacts,
  goToDashboard,
}: AddressBookViewProps) => {
  return (
    <AppLayout>
      <div className="pb-12 bg-secondary rounded-b-2xl">
        <MenuBar variant="dashboard" onLogoClicked={goToDashboard} />
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
                className="px-6 flex justify-between btn text-base font-medium"
              >
                <p>{contact.name}</p>
                <p>
                  {truncateString({
                    value: contact.address,
                    firstCharCount: 4,
                    endCharCount: 4,
                  })}
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}
