import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Label, RadioGroup, RadioGroupItem } from '@palladxyz/ui'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'

import { FormError } from '../../common/components/FormError'
import { FormLabel } from '../../common/components/FormLabel'
import { OutgoingTransaction } from '../../common/types'
import { TransactionFee } from '../../wallet/lib/const'
import { useTransactionStore } from '../../wallet/store/transaction'
import { SendFormSchema } from './SendForm.schema'

export const SendForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const setTransactionDetails = useTransactionStore((state) => state.set)
  // const { data: accountQuery, isLoading: accountLoading } = useAccount()
  // if (accountLoading) return null
  // const account = accountQuery?.result?.data?.account
  // const totalBalance =
  //   account?.balance?.total && parseFloat(account?.balance?.total)
  const {
    register,
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
    // const { fee } = getValues()
    // const currentFee = TransactionFee[fee]
    // totalBalance && setValue('amount', totalBalance - currentFee)
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
        <Label>Receiver</Label>
        <Input placeholder="Receiver Address" autoFocus {...register('to')} />
        <FormError>{errors.to?.message}</FormError>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Amount</Label>
        <Input placeholder="Transaction Amount" {...register('amount')} />
        <p>{errors.amount?.message}</p>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Memo</Label>
        <Input placeholder="Memo" {...register('memo')} />
        <p>{errors.memo?.message}</p>
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <Label>Fee</Label>
        <RadioGroup defaultValue="comfortable">
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
        <p>{errors.fee?.message}</p>
      </div>
      <Button type="submit">Next</Button>
    </form>
  )
}
