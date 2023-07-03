import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, Input, RadioGroup } from '@palladxyz/ui'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-native'

import { FormError } from '../../common/components/FormError'
import { FormLabel } from '../../common/components/FormLabel'
import { TransactionFee } from '../../common/lib/const'
import { useAccount } from '../../common/lib/hooks'
import { useTransactionStore } from '../../common/store/transaction'
import { OutgoingTransaction } from '../../common/types'
import { SendFormSchema } from './SendForm.schema'

export const SendForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const setTransactionDetails = useTransactionStore((state) => state.set)
  const { data: accountQuery, isLoading: accountLoading } = useAccount()
  if (accountLoading) return null
  const account = accountQuery?.result?.data?.account
  const totalBalance =
    account?.balance?.total && parseFloat(account?.balance?.total)
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(SendFormSchema),
    defaultValues: {
      to: '',
      amount: undefined as number | undefined,
      fee: 'default',
      memo: ''
    }
  })
  const setMaxAmount = () => {
    const { fee } = getValues()
    const currentFee = TransactionFee[fee]
    totalBalance && setValue('amount', totalBalance - currentFee)
  }
  const onSubmit = (payload: OutgoingTransaction) => {
    const { fee } = getValues()
    const currentFee = TransactionFee[fee]
    setTransactionDetails({
      to: payload.to,
      fee: currentFee,
      amount: payload.amount,
      memo: payload.memo,
      kind: 'payment'
    })
    navigate('/transactions/summary')
  }
  useEffect(() => {
    setValue('to', location.state?.address || '')
  }, [])
  return (
    <Box css={{ gap: 16, flex: 1 }}>
      <Box css={{ gap: 8 }}>
        <FormLabel
          button={{
            label: 'Address Book',
            onPress: () => navigate('/contacts')
          }}
          required
        >
          Receiver
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
        <FormLabel
          button={{
            label: 'Max Amount',
            onPress: setMaxAmount
          }}
          required
        >
          Amount
        </FormLabel>
        <Controller
          control={control}
          name="amount"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              keyboardType="numeric"
              placeholder="Transaction Amount"
              onSubmitEditing={handleSubmit(onSubmit)}
            />
          )}
        />
        <FormError>{errors.amount?.message}</FormError>
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
