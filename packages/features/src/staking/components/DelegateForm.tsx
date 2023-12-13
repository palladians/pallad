import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { OutgoingTransaction } from '../../common/types'
import { DelegateFormSchema } from './DelegateForm.schema'

export const DelegateForm = () => {
  const location = useLocation()
  const navigate = useNavigate()
  // const setTransactionDetails = useTransactionStore((state) => state.set)
  const {
    register,
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
    <form
      className="flex flex-col flex-1 gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="blockProducer">Block Producer</Label>
        <Input
          id="blockProducer"
          placeholder="Receiver Address"
          autoFocus
          {...register('to')}
        />
        <p>{errors.to?.message}</p>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="memo">Memo</Label>
        <Input id="memo" placeholder="Memo" {...register('memo')} />
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
