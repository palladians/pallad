import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useLocation, useNavigate } from "react-router-dom"

import { TransactionFee } from "@/common/lib/const"
import { useTransactionStore } from "@/common/store/transaction"
import { FormError } from "@/components/form-error"

import MinaIcon from "@/common/assets/mina.svg?react"
import { formatCurrency } from "@/common/lib/currency"
import { FeePicker, TransactionFeeShort } from "@/components/fee-picker"
import { TransactionKind } from "@palladxyz/mina-core"
import { ChevronRightIcon, SearchIcon } from "lucide-react"
import { SendFormSchema, type SendFormSchemaProps } from "./send-form.schema"

type SendFormProps = {
  balance: number
  fiatPrice: number
  advanced: boolean
  setAdvanced: (advanced: boolean) => void
}

export const SendForm = ({
  balance,
  fiatPrice,
  advanced,
  setAdvanced,
}: SendFormProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const setTransactionDetails = useTransactionStore((state) => state.set)
  const setKind = useTransactionStore((state) => state.setKind)
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isValid },
    watch,
  } = useForm({
    resolver: zodResolver(SendFormSchema),
    defaultValues: {
      to: "",
      amount: undefined as number | undefined,
      fee: "default",
      memo: "",
    },
  })
  const feeValue = watch("fee")
  // biome-ignore lint: only first render
  useEffect(() => {
    setValue("to", location.state?.address || "")
  }, [])
  const totalBalance = balance && balance / 1_000_000_000
  const totalBalanceFiat = totalBalance * fiatPrice
  const setMaxAmount = async () => {
    const { fee } = getValues()
    const currentFee = TransactionFee[fee]
    totalBalance && setValue("amount", totalBalance - currentFee)
  }
  const onSubmit = (payload: SendFormSchemaProps) => {
    const { fee } = getValues()
    const currentFee = TransactionFee[fee]
    setKind(TransactionKind.PAYMENT)
    setTransactionDetails({
      to: payload.to,
      fee: currentFee,
      amount: payload.amount,
      memo: payload.memo ?? "",
    })
    navigate("/transactions/summary")
  }
  return (
    <form
      className="flex flex-col gap-1 flex-1 pb-8 items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex justify-between items-center w-full">
        <h1 className="text-3xl">Send</h1>
        <div className="form-control">
          <label className="label cursor-pointer gap-2">
            <span className="label-text">Advanced</span>
            <input
              type="checkbox"
              className="toggle toggle-primary border-none"
              checked={advanced}
              onClick={() => setAdvanced(!advanced)}
            />
          </label>
        </div>
      </div>
      <div className="card bg-secondary w-full flex flex-row justify-between items-center p-2 mb-1">
        <div className="flex gap-2">
          <div className="btn btn-neutral btn-circle">
            <MinaIcon width={24} height={24} />
          </div>
          <div className="flex flex-col">
            <div>Mina</div>
            <div className="text-[#7D7A9C]">MINA</div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex flex-col text-right">
            <div>{totalBalance}</div>
            <div className="text-[#7D7A9C]">
              {formatCurrency({ value: totalBalanceFiat })}
            </div>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm btn-circle text-primary"
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>
      <label className="input flex items-center gap-2 py-7 w-full">
        <input
          id="receiverAddress"
          type="text"
          className="grow"
          placeholder="Address"
          data-testid="send__to"
          {...register("to")}
        />
        <button
          type="button"
          className="btn bg-neutral -mr-3"
          onClick={() => navigate("/contacts")}
        >
          <SearchIcon size={24} className="text-primary" />
        </button>
      </label>
      <FormError>{errors.to?.message}</FormError>
      <label className="input flex items-center gap-2 py-7 w-full">
        <input
          id="amount"
          type="text"
          className="grow"
          placeholder="Amount"
          data-testid="send__amount"
          {...register("amount")}
        />
        <button
          type="button"
          className="btn bg-neutral text-primary -mr-3"
          onClick={setMaxAmount}
        >
          max
        </button>
      </label>
      <FormError>{errors.amount?.message}</FormError>
      {advanced ? (
        <>
          <label className="input flex items-center gap-2 py-7 w-full">
            <input
              id="memo"
              type="text"
              className="grow"
              placeholder="Memo"
              data-testid="send__memo"
              {...register("memo")}
            />
            <button type="button" className="badge badge-neutral -mr-3">
              optional
            </button>
          </label>
          <FormError>{errors.memo?.message}</FormError>
          <FeePicker feeValue={feeValue} setValue={setValue} />
        </>
      ) : (
        <TransactionFeeShort
          feeValue={feeValue}
          onClick={() => setAdvanced(!advanced)}
        />
      )}
      <button
        type="submit"
        className="btn btn-primary max-w-48 w-full mt-auto"
        data-testid="send__nextButton"
        disabled={!isValid}
      >
        Next
      </button>
    </form>
  )
}
