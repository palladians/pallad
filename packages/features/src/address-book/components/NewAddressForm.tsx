import { zodResolver } from '@hookform/resolvers/zod'
import { PlusIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useAddressBookStore } from '../../common/store/addressBook'
import { NewAddressFormSchema } from './NewAddressForm.schema'

export const NewAddressForm = () => {
  const navigate = useNavigate()
  const addContact = useAddressBookStore((state) => state.addContact)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(NewAddressFormSchema),
    defaultValues: {
      name: '',
      address: ''
    }
  })
  const onSubmit = (data: Record<string, string>) => {
    addContact(data)
    return navigate('/contacts')
  }
  return (
    <form
      className="flex flex-col flex-1 gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="gap-2">
        <Label htmlFor="contactName">Contact's Name</Label>
        <Input
          id="contactName"
          placeholder="Name"
          data-testid="newAddress__nameInput"
          {...register('name')}
        />
        <p>{errors.name?.message}</p>
      </div>
      <div className="gap-2 flex-1">
        <Label htmlFor="contactAddress">Receiver Address</Label>
        <Input
          id="contactAddress"
          placeholder="B62XXXXXXXXXXXX"
          data-testid="newAddress__addressInput"
          {...register('address')}
        />
        <p>{errors.address?.message}</p>
      </div>
      <Button type="submit" data-testid="newAddress__createButton">
        <PlusIcon size={16} />
        Create Contact
      </Button>
    </form>
  )
}
