import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'

import { TransactionFee } from '@/common/lib/const'
import { useTransactionStore } from '@/common/store/transaction'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { OutgoingTransaction } from '../../common/types'
import { DelegateFormSchema } from './DelegateForm.schema'

export const DelegateForm = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const setTransactionDetails = useTransactionStore((state) => state.set)
  const setKind = useTransactionStore((state) => state.setKind)
  const {
    register,
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
    setKind('staking')
    setTransactionDetails({
      to: payload.to,
      fee: String(currentFee),
      memo: payload.memo
    })
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
        <RadioGroup
          defaultValue="default"
          onValueChange={(value) => setValue('fee', value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="slow" id="feeSlow" />
            <Label htmlFor="feeSlow">Slow ({TransactionFee.slow} MINA)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="default" id="feeDefault" defaultChecked />
            <Label htmlFor="feeDefault">
              Default ({TransactionFee.default} MINA)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fast" id="feeFast" />
            <Label htmlFor="feeFast">Fast ({TransactionFee.fast} MINA)</Label>
          </div>
        </RadioGroup>
        <p>{errors.fee?.message}</p>
      </div>
      <Button type="submit">Next</Button>
    </form>
  )
}
