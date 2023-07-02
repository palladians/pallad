import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, Input } from '@palladxyz/ui'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-native'

import { FormError } from '../../common/components/FormError'
import { FormLabel } from '../../common/components/FormLabel'
import { useAddressBookStore } from '../../common/store/addressBook'
import { NewAddressFormSchema } from './NewAddressForm.schema'

export const NewAddressForm = () => {
  const navigate = useNavigate()
  const addContact = useAddressBookStore((state) => state.addContact)
  const {
    control,
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
    <Box css={{ flex: 1, gap: 16 }}>
      <Box css={{ gap: 8 }}>
        <FormLabel>Contact's Name</FormLabel>
        <Controller
          control={control}
          name="name"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              onChange={onChange}
              value={value}
              onBlur={onBlur}
              onSubmitEditing={handleSubmit(onSubmit)}
              placeholder="Name"
              testID="send__contactName"
            />
          )}
        />
        <FormError>{errors.name?.message}</FormError>
      </Box>
      <Box css={{ gap: 8, flex: 1 }}>
        <FormLabel>Receiver Address</FormLabel>
        <Controller
          control={control}
          name="address"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              onChange={onChange}
              value={value}
              onBlur={onBlur}
              onSubmitEditing={handleSubmit(onSubmit)}
              placeholder="B62XXXXXXXXXXXX"
              testID="send__contactAddress"
            />
          )}
        />
        <FormError>{errors.address?.message}</FormError>
      </Box>
      <Button onPress={handleSubmit(onSubmit)}>Create Contact</Button>
    </Box>
  )
}
