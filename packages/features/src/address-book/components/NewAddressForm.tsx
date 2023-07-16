import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Label } from '@palladxyz/ui'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useAddressBookStore } from '../../wallet/store/addressBook'
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
    <form className="flex-1 gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="gap-2">
        <Label>Contact's Name</Label>
        <Input
          placeholder="Name"
          data-testid="send__contactName"
          {...register('name')}
        />
        <p>{errors.name?.message}</p>
      </div>
      <div className="gap-2 flex-1">
        <Label>Receiver Address</Label>
        <Input
          placeholder="B62XXXXXXXXXXXX"
          data-testid="send__contactAddress"
          {...register('address')}
        />
        <p>{errors.address?.message}</p>
      </div>
      <Button type="submit">Create Contact</Button>
    </form>
  )
}
