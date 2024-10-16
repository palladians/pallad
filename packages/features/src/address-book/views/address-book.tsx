import { truncateString } from "@/common/lib/string"
import type { Contact } from "@/common/types"
import { AppLayout } from "@/components/app-layout"
import { MenuBar } from "@/components/menu-bar"
import { Copy, Plus, TrashIcon } from "lucide-react"
import type { MouseEvent } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { toast } from "sonner"

type AddressBookViewProps = {
  contacts: Contact[]
  removeContact: ({ index }: { index: number }) => void
}

export const AddressBookView = ({
  contacts,
  removeContact,
}: AddressBookViewProps) => {
  const onAddressCopy = (
    event: MouseEvent<HTMLButtonElement>,
    address: string,
  ) => {
    event.preventDefault()
    navigator.clipboard.writeText(address)
    toast.success("Address copied")
  }
  const { t } = useTranslation()
  return (
    <AppLayout>
      <div className="pb-12 bg-secondary rounded-b-2xl">
        <MenuBar variant="dashboard" />
        <h2 className="ml-8 mt-1 text-3xl">{t("addressBook")}</h2>
      </div>
      <div className="py-6 px-8 space-y-2">
        <Link
          to="/contacts/new"
          className="flex btn text-base font-medium"
          data-testid="addressBook/addAddressButton"
        >
          <Plus width={16} height={16} className="text-[#F6C177]" />
          <p>{t("addNewContact")}</p>
        </Link>
        <div className="space-y-2">
          {contacts.map((contact, index) => {
            return (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: won't update
                key={index}
                className="relative px-6 flex justify-between btn text-base font-medium overflow-hidden group"
                data-testid="addressBook/contact"
              >
                <Link to="/send" state={{ address: contact.address }}>
                  {contact.name}
                </Link>
                <p>
                  {truncateString({
                    value: contact.address,
                    firstCharCount: 4,
                    endCharCount: 4,
                  })}
                </p>
                <div className="flex gap-2 absolute right-4 top-3 bg-neutral opacity-0 group-hover:opacity-100 translate-x-16 group-hover:translate-x-0 transition-all">
                  <button
                    type="button"
                    onClick={(event) => onAddressCopy(event, contact.address)}
                  >
                    <Copy width={24} height={24} className="text-[#F6C177]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeContact({ index })}
                    data-testid="addressBook/removeAddress"
                  >
                    <TrashIcon
                      width={24}
                      height={24}
                      className="text-[#F6C177]"
                    />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}
