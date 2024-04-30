import { PlusIcon } from "lucide-react"

import type { Contact } from "@/common/types"
import { AppLayout } from "@/components/app-layout"

import { MenuBar } from "@/components/menu-bar"
import { ContactTile } from "../components/contact-tile"

const DonatePallad = {
  name: "Donate To Pallad",
  address: "B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS",
}

type AddressBookViewProps = {
  contacts: Contact[]
}

export const AddressBookView = ({ contacts }: AddressBookViewProps) => {
  return (
    <AppLayout>
      <MenuBar variant="dashboard" />
      <div className="flex flex-col gap-2 p-4">
        <ContactTile
          contact={{
            name: DonatePallad.name,
            address: DonatePallad.address,
          }}
        />
        {contacts.map((contact, i) => (
          // biome-ignore lint: it won't update
          <ContactTile key={i} contact={contact} index={i} />
        ))}
      </div>
    </AppLayout>
  )
}
