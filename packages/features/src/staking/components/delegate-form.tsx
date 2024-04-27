import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useLocation, useNavigate } from "react-router-dom"

import { TransactionFee } from "@/common/lib/const"
import { useTransactionStore } from "@/common/store/transaction"
import type { OutgoingTransaction } from "@/common/types"
import { ButtonArrow } from "@/components/button-arrow"
import { FormError } from "@/components/form-error"
import { cn } from "@/lib/utils"

import { DelegateFormSchema } from "./delegate-form.schema"

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
    formState: { errors },
  } = useForm({
    resolver: zodResolver(DelegateFormSchema),
    defaultValues: {
      to: "",
      fee: "default",
      memo: "",
    },
  })
  const onSubmit = (payload: OutgoingTransaction) => {
    const { fee } = getValues()
    const currentFee = TransactionFee[fee]
    setKind("staking")
    setTransactionDetails({
      to: payload.to,
      fee: String(currentFee),
      memo: payload.memo,
    })
    navigate("/transactions/summary")
  }
  // biome-ignore lint: only first render
  useEffect(() => {
    setValue("to", location.state?.address || "")
  }, [])
  return (
    <form
      className="flex flex-col flex-1 gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2">
        <label
          htmlFor="blockProducer"
          className={cn(errors.to && "text-destructive")}
        >
          Block Producer
        </label>
        <input
          id="blockProducer"
          placeholder="Receiver Address"
          className={errors.to && "border-destructive"}
          data-testid="delegate__to"
          {...register("to")}
        />
        <FormError>{errors.to?.message}</FormError>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="memo" className={cn(errors.memo && "text-destructive")}>
          Memo
        </label>
        <input
          id="memo"
          placeholder="Memo"
          className={errors.memo && "border-destructive"}
          data-testid="delegate__memo"
          {...register("memo")}
        />
        <FormError>{errors.memo?.message}</FormError>
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <label className={cn(errors.fee && "text-destructive")}>Fee</label>
        {/* <RadioGroup
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
        </RadioGroup> */}
        <FormError>{errors.fee?.message}</FormError>
      </div>
      <button
        type="submit"
        className="group gap-2"
        data-testid="delegate__nextButton"
      >
        <span>Next</span>
        <ButtonArrow />
      </button>
    </form>
  )
}
