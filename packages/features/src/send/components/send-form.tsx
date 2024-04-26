import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useLocation, useNavigate } from "react-router-dom"

import { useAccount } from "@/common/hooks/use-account"
import { TransactionFee } from "@/common/lib/const"
import { useTransactionStore } from "@/common/store/transaction"
import type { OutgoingTransaction } from "@/common/types"
import { ButtonArrow } from "@/components/button-arrow"
import { FormError } from "@/components/form-error"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

import { SendFormSchema } from "./send-form.schema"

export const SendForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const setTransactionDetails = useTransactionStore((state) => state.set)
  const setKind = useTransactionStore((state) => state.setKind)
  const { data: accountProperties, isLoading: accountLoading } = useAccount()
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: zodResolver(SendFormSchema),
    defaultValues: {
      to: "",
      amount: "",
      fee: "default",
      memo: "",
    },
  })
  // biome-ignore lint: only first render
  useEffect(() => {
    setValue("to", location.state?.address || "")
  }, [])
  if (accountLoading) return null
  const totalBalance =
    accountProperties.balance && accountProperties.balance / 1_000_000_000
  const setMaxAmount = async () => {
    const { fee } = getValues()
    const currentFee = TransactionFee[fee]
    totalBalance && setValue("amount", String(totalBalance - currentFee))
    await trigger()
  }
  const onSubmit = (payload: OutgoingTransaction) => {
    const { fee } = getValues()
    const currentFee = TransactionFee[fee]
    setKind("transaction")
    setTransactionDetails({
      to: payload.to,
      fee: String(currentFee),
      amount: payload.amount,
      memo: payload.memo,
    })
    navigate("/transactions/summary")
  }
  return (
    <form
      className="flex flex-col gap-4 flex-1"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <Label
            htmlFor="receiverAddress"
            className={cn(errors.to && "text-destructive")}
          >
            Receiver
          </Label>
          <Button
            type="button"
            variant="link"
            className="!h-auto !p-0"
            onClick={() => navigate("/contacts")}
          >
            Address Book
          </Button>
        </div>
        <Input
          id="receiverAddress"
          placeholder="Receiver Address"
          className={errors.to && "border-destructive"}
          data-testid="send__to"
          autoFocus
          {...register("to")}
        />
        <FormError>{errors.to?.message}</FormError>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <Label
            htmlFor="amount"
            className={cn(errors.amount && "text-destructive")}
          >
            Amount
          </Label>
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
          className={errors.amount && "border-destructive"}
          data-testid="send__amount"
          {...register("amount")}
        />
        <FormError>{errors.amount?.message}</FormError>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="memo" className={cn(errors.memo && "text-destructive")}>
          Memo
        </Label>
        <Input id="memo" placeholder="Memo" {...register("memo")} />
        <FormError>{errors.memo?.message}</FormError>
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <Label className={cn(errors.fee && "text-destructive")}>Fee</Label>
        <RadioGroup
          defaultValue="default"
          onValueChange={(value) => setValue("fee", value)}
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
        <FormError>{errors.fee?.message}</FormError>
      </div>
      <Button
        type="submit"
        className="group gap-2"
        data-testid="send__nextButton"
      >
        <span>Next</span>
        <ButtonArrow />
      </Button>
    </form>
  )
}
