import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Label } from '@palladxyz/ui'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'

import { OutgoingTransaction } from '../../common/types'
import { DelegateFormSchema } from './DelegateForm.schema'

export const DelegateForm = () => {
  const location = useLocation()
  const navigate = useNavigate()
  // const setTransactionDetails = useTransactionStore((state) => state.set)
  const {
    register,
    control,
    handleSubmit,
    setValue,
    // getValues,
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
    console.log('>>>P', payload)
    // const { fee } = getValues()
    // const currentFee = TransactionFee[fee]
    // setTransactionDetails({
    //   to: payload.to,
    //   fee: currentFee,
    //   memo: payload.memo,
    //   kind: 'staking'
    // })
    navigate('/transactions/summary')
  }
  useEffect(() => {
    setValue('to', location.state?.address || '')
  }, [])
  return (
    <form className="flex-1 gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="gap-2">
        <Label>Block Producer</Label>
        <Input placeholder="Receiver Address" autoFocus {...register('to')} />
        <p>{errors.to?.message}</p>
      </div>
      <div className="gap-2">
        <Label>Memo</Label>
        <Input placeholder="Memo" {...register('memo')} />
        <p>{errors.memo?.message}</p>
      </div>
      <div className="gap-2 flex-1">
        <Label>Fee</Label>
        {/*<RadioGroup*/}
        {/*  options={[*/}
        {/*    { value: 'slow', label: `Slow (${TransactionFee.slow} MINA)` },*/}
        {/*    {*/}
        {/*      value: 'default',*/}
        {/*      label: `Default (${TransactionFee.default} MINA)`,*/}
        {/*      defaultSelected: true*/}
        {/*    },*/}
        {/*    { value: 'fast', label: `Fast (${TransactionFee.fast} MINA)` }*/}
        {/*  ]}*/}
        {/*  onChange={(value: string) => setValue('fee', value)}*/}
        {/*/>*/}
        <p>{errors.fee?.message}</p>
      </div>
      <Button type="submit">Next</Button>
    </form>
  )
}
