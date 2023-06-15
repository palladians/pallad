interface FormatCurrencyProps {
  value: number
  precision?: number
}

export const formatCurrency = ({
  value,
  precision = 2
}: FormatCurrencyProps) => {
  const currencyFormatter = Intl.NumberFormat('en', {
    style: 'currency',
    maximumFractionDigits: precision,
    minimumFractionDigits: precision
  })
  return currencyFormatter.format(value)
}
