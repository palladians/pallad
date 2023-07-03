import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, Input, RadioGroup } from '@palladxyz/ui'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-native'

import { FormError } from '../../common/components/FormError'
import { FormLabel } from '../../common/components/FormLabel'
import { TransactionFee } from '../../common/lib/const'
import { useTransactionStore } from '../../common/store/transaction'
import { OutgoingTransaction } from '../../common/types'
import { DelegateFormSchema } from './DelegateForm.schema'

export const DelegateForm = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const setTransactionDetails = useTransactionStore((state) => state.set)
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(DelegateFormSchema),
    defaultValues: {
      to: '',
      fee: 'default',
      memo: ''
    }
  })
  const onSubmit = (payload: OutgoingTransaction) => {
    const { fee } = getValues()
    const currentFee = TransactionFee[fee]
    setTransactionDetails({
      to: payload.to,
      fee: currentFee,
      memo: payload.memo,
      kind: 'staking'
    })
    navigate('/transactions/summary')
  }
  useEffect(() => {
    setValue('to', location.state?.address || '')
  }, [])
  return (
    <Box css={{ flex: 1, gap: 16 }}>
      <Box css={{ gap: 8 }}>
        <FormLabel
          button={{
            label: 'Find Producer',
            onPress: () => navigate('/staking/producers')
          }}
        >
          Block Producer
        </FormLabel>
        <Controller
          control={control}
          name="to"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              placeholder="Receiver Address"
              onSubmitEditing={handleSubmit(onSubmit)}
              autoFocus
            />
          )}
        />
        <FormError>{errors.to?.message}</FormError>
      </Box>
      <Box css={{ gap: 8 }}>
        <FormLabel>Memo</FormLabel>
        <Controller
          control={control}
          name="memo"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Memo"
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              onSubmitEditing={handleSubmit(onSubmit)}
            />
          )}
        />
        <FormError>{errors.memo?.message}</FormError>
      </Box>
      <Box css={{ gap: 8, flex: 1 }}>
        <FormLabel>Fee</FormLabel>
        <RadioGroup
          options={[
            { value: 'slow', label: `Slow (${TransactionFee.slow} MINA)` },
            {
              value: 'default',
              label: `Default (${TransactionFee.default} MINA)`,
              defaultSelected: true
            },
            { value: 'fast', label: `Fast (${TransactionFee.fast} MINA)` }
          ]}
          onChange={(value: string) => setValue('fee', value)}
        />
        <FormError>{errors.fee?.message}</FormError>
      </Box>
      <Button onPress={handleSubmit(onSubmit)}>Next</Button>
    </Box>
  )
}
