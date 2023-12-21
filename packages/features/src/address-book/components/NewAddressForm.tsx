import { zodResolver } from '@hookform/resolvers/zod'
import { PlusIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { ButtonArrow } from '@/components/button-arrow'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

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
        <Label
          htmlFor="contactName"
          className={cn(errors.name && 'text-destructive')}
        >
          Contact's Name
        </Label>
        <Input
          id="contactName"
          placeholder="Name"
          data-testid="newAddress__nameInput"
          className={cn(errors.name && 'border-destructive')}
          {...register('name')}
          autoFocus
        />
        <p className="text-destructive">{errors.name?.message}</p>
      </div>
      <div className="gap-2 flex-1">
        <Label
          htmlFor="contactAddress"
          className={cn(errors.address && 'text-destructive')}
        >
          Receiver Address
        </Label>
        <Input
          id="contactAddress"
          placeholder="B62XXXXXXXXXXXX"
          data-testid="newAddress__addressInput"
          className={cn(errors.address && 'border-destructive')}
          {...register('address')}
        />
        <p className="text-destructive">{errors.address?.message}</p>
      </div>
      <Button
        type="submit"
        className="group gap-2"
        data-testid="newAddress__createButton"
      >
        <PlusIcon size={16} />
        <span>Create Contact</span>
        <ButtonArrow />
      </Button>
    </form>
  )
}
