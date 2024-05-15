interface FormatCurrencyProps {
  value: number
  precision?: number
  currency?: string
}

export const formatCurrency = ({
  value,
  precision = 2,
  currency = "USD",
}: FormatCurrencyProps) => {
  const currencyFormatter = Intl.NumberFormat("en", {
    style: "currency",
    maximumFractionDigits: precision,
    minimumFractionDigits: precision,
    currency,
  })
  return currencyFormatter.format(value)
}
