import { useStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'

import { localPersistence } from '../lib/storage'
import { Contact } from '../types'

type AddressBookState = {
  contacts: Contact[]
}

type AddressBookMutators = {
  addContact: (contact: Contact) => void
  removeContact: ({ index }: { index: number }) => void
}

type AddressBookStore = AddressBookState & AddressBookMutators

export const addressBookStore = createStore<AddressBookStore>()(
  persist(
    (set, get) => ({
      contacts: [],
      addContact(contact) {
        const { contacts } = get()
        return set({ contacts: [...contacts, contact] })
      },
      removeContact({ index }) {
        const { contacts } = get()
        const updatedContacts = contacts.filter((_, i) => index !== i)
        return set({ contacts: updatedContacts })
      }
    }),
    {
      name: 'PalladAddressBook',
      storage: createJSONStorage(() => localPersistence)
    }
  )
)

export const useAddressBookStore = (selector: any) =>
  useStore(addressBookStore, selector)
