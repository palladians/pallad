import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Label, RadioGroup, RadioGroupItem } from '@palladxyz/ui'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'

import { FormError } from '../../common/components/FormError'
import { useAccount } from '../../common/hooks/useAccount'
import { OutgoingTransaction } from '../../common/types'
import { TransactionFee } from '../../wallet/lib/const'
import { useTransactionStore } from '../../wallet/store/transaction'
import { SendFormSchema } from './SendForm.schema'

export const SendForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const setTransactionDetails = useTransactionStore((state) => state.set)
  const { data: accountData, isLoading: accountLoading } = useAccount()
  if (accountLoading) return null
  const totalBalance =
    accountData?.balance.total && accountData.balance.total / 1_000_000_000
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    trigger
  } = useForm({
    resolver: zodResolver(SendFormSchema),
    defaultValues: {
      to: '',
      amount: '',
      fee: 'default',
      memo: ''
    }
  })
  const setMaxAmount = async () => {
    const { fee } = getValues()
    const currentFee = TransactionFee[fee]
    totalBalance && setValue('amount', String(totalBalance - currentFee))
    await trigger()
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
    <form
      className="flex flex-col gap-4 flex-1"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="receiverAddress">Receiver</Label>
          <Button
            type="button"
            variant="link"
            className="!h-auto !p-0"
            onClick={() => navigate('/contacts')}
          >
            Address Book
          </Button>
        </div>
        <Input
          id="receiverAddress"
          placeholder="Receiver Address"
          className={errors.to && 'border-red-500'}
          autoFocus
          {...register('to')}
        />
        <FormError>{errors.to?.message}</FormError>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="amount">Amount</Label>
          <Button
            type="button"
            variant="link"
            className="!h-auto !p-0"
            onClick={setMaxAmount}
          >
            Max Amount
          </Button>
        </div>
        <Input
          id="amount"
          placeholder="Transaction Amount"
          className={errors.amount && 'border-red-500'}
          {...register('amount')}
        />
        <FormError>{errors.amount?.message}</FormError>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="memo">Memo</Label>
        <Input id="memo" placeholder="Memo" {...register('memo')} />
        <p>{errors.memo?.message}</p>
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <Label>Fee</Label>
        <RadioGroup defaultValue="default">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="flow" id="feeSlow" />
            <Label htmlFor="feeSlow">Slow</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="default" id="feeDefault" defaultChecked />
            <Label htmlFor="feeDefault">Default</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fast" id="feeFast" />
            <Label htmlFor="feeFast">Fast</Label>
          </div>
        </RadioGroup>
        <FormError>{errors.fee?.message}</FormError>
      </div>
      <Button type="submit">Next</Button>
    </form>
  )
}
