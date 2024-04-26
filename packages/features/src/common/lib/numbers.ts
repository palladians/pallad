interface FormatCurrencyProps {
  value: number
}

export const formatCompact = ({ value }: FormatCurrencyProps) => {
  const currencyFormatter = Intl.NumberFormat("en", { notation: "compact" })
  return currencyFormatter.format(value)
}
