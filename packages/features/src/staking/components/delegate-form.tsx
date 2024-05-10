import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useLocation, useNavigate } from "react-router-dom"

import { TransactionFee } from "@/common/lib/const"
import { useTransactionStore } from "@/common/store/transaction"
import { FormError } from "@/components/form-error"

import { FeePicker, TransactionFeeShort } from "@/components/fee-picker"
import type { SendFormSchemaProps } from "@/send/components/send-form.schema"
import { TransactionKind } from "@palladxyz/mina-core"
import { DelegateFormSchema } from "./delegate-form.schema"

type DelegateFormProps = {
  advanced: boolean
  setAdvanced: (advanced: boolean) => void
}

export const DelegateForm = ({ advanced, setAdvanced }: DelegateFormProps) => {
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
    watch,
  } = useForm({
    resolver: zodResolver(DelegateFormSchema),
    defaultValues: {
      to: "",
      fee: "default",
      memo: "",
    },
  })
  const feeValue = watch("fee")
  const onSubmit = (payload: SendFormSchemaProps) => {
    const { fee } = getValues()
    const currentFee = TransactionFee[fee]
    setKind(TransactionKind.STAKE_DELEGATION)
    setTransactionDetails({
      to: payload.to,
      fee: currentFee,
      memo: payload.memo ?? "",
    })
    navigate("/transactions/summary")
  }
  // biome-ignore lint: only first render
  useEffect(() => {
    setValue("to", location.state?.address || "")
  }, [])
  return (
    <form
      className="flex flex-col flex-1 gap-4 px-8 pb-8 items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-3xl w-full">New Stake</h1>
      <div className="flex flex-col gap-2 w-full">
        <input
          id="blockProducer"
          placeholder="Validator Address"
          className="input"
          data-testid="delegate__to"
          {...register("to")}
        />
        <FormError>{errors.to?.message}</FormError>
      </div>
      {advanced ? (
        <FeePicker feeValue={feeValue} setValue={setValue} />
      ) : (
        <TransactionFeeShort
          feeValue={feeValue}
          onClick={() => setAdvanced(!advanced)}
        />
      )}
      <div className="flex-1" />
      <button
        type="submit"
        className="btn btn-primary max-w-48 w-full"
        data-testid="delegate__nextButton"
      >
        <span>Next</span>
      </button>
    </form>
  )
}
