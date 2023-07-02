import { Box, Button, Input } from '@palladxyz/ui'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-native'

import { AppLayout } from '../../common/components/AppLayout'
import { FormLabel } from '../../common/components/FormLabel'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useAddressBookStore } from '../../common/store/addressBook'

export const NewAddressView = () => {
  const navigate = useNavigate()
  const addContact = useAddressBookStore((state) => state.addContact)
  const { control, handleSubmit } = useForm()
  const onSubmit = (data: Record<string, string>) => {
    addContact(data)
    return navigate('/contacts')
  }
  return (
    <AppLayout>
      <Box css={{ padding: '$md', flex: 1, gap: 24 }}>
        <ViewHeading
          title="New Address"
          backButton={{ onPress: () => navigate(-1) }}
        />
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
          </Box>
          <Box css={{ gap: 8 }}>
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
          </Box>
        </Box>
        <Button onPress={handleSubmit(onSubmit)}>Create Contact</Button>
      </Box>
    </AppLayout>
  )
}
