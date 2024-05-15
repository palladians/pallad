import { TransactionFee } from "@/common/lib/const"
import { clsx } from "clsx"

type TransactionFeeShortProps = {
  feeValue: keyof typeof TransactionFee
  onClick: () => void
}

export const TransactionFeeShort = ({
  feeValue,
  onClick,
}: TransactionFeeShortProps) => {
  return (
    <button
      type="button"
      className="btn btn-link text-base-content no-underline hover:no-underline"
      onClick={onClick}
    >
      <span className="underline">Transaction fee:</span>
      <span>{TransactionFee[feeValue]} MINA</span>
    </button>
  )
}

type FeePickerProps = {
  feeValue: keyof typeof TransactionFee
  setValue: (key: any, value: string) => void
}

export const FeePicker = ({ feeValue, setValue }: FeePickerProps) => {
  return (
    <div className="join w-full">
      <button
        type="button"
        className={clsx(
          "btn flex-col join-item flex-nowrap",
          feeValue === "slow" ? "btn-primary" : "btn-secondary",
        )}
        onClick={() => setValue("fee", "slow")}
      >
        <div>Slow</div>
        <div className="text-nowrap">{TransactionFee.slow} MINA</div>
      </button>
      <button
        type="button"
        className={clsx(
          "btn flex-col join-item flex-1 flex-nowrap",
          feeValue === "default" ? "btn-primary" : "btn-secondary",
        )}
        onClick={() => setValue("fee", "default")}
      >
        <div>Normal</div>
        <div className="text-nowrap">{TransactionFee.default} MINA</div>
      </button>
      <button
        type="button"
        className={clsx(
          "btn flex-col join-item flex-nowrap",
          feeValue === "fast" ? "btn-primary" : "btn-secondary",
        )}
        onClick={() => setValue("fee", "fast")}
      >
        <div>Fast</div>
        <div className="text-nowrap">{TransactionFee.fast} MINA</div>
      </button>
    </div>
  )
}
