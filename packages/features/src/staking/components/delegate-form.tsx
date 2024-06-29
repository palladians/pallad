import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Link, useLocation, useNavigate } from "react-router-dom"

import { TransactionFee } from "@/common/lib/const"
import { useTransactionStore } from "@/common/store/transaction"
import { FormError } from "@/components/form-error"

import { FeePicker, TransactionFeeShort } from "@/components/fee-picker"
import type { SendFormSchemaProps } from "@/send/components/send-form.schema"
import { TransactionType } from "@palladxyz/mina-core"
import { ExternalLinkIcon } from "lucide-react"
import { DelegateFormSchema } from "./delegate-form.schema"

type DelegateFormProps = {
  advanced: boolean
  setAdvanced: (advanced: boolean) => void
}

export const DelegateForm = ({ advanced, setAdvanced }: DelegateFormProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const setTransactionDetails = useTransactionStore((state) => state.set)
  const setType = useTransactionStore((state) => state.setType)
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
    setType(TransactionType.STAKE_DELEGATION)
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
      <h1 className="text-3xl w-full">Select a validator</h1>
      <Link
        to="/staking/producers"
        className="card bg-secondary w-full flex-row py-2 px-4 items-center justify-between"
      >
        <h2 className="text-mint">Find a validator</h2>
        <div className="bg-neutral rounded-full p-2">
          <ExternalLinkIcon />
        </div>
      </Link>
      <div className="flex flex-col gap-2 w-full">
        <input
          id="blockProducer"
          placeholder="Validator Address"
          className="input"
          data-testid="delegate/to"
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
        data-testid="formSubmit"
      >
        <span>Next</span>
      </button>
    </form>
  )
}
