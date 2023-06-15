interface TruncateProps {
  value: string
  firstCharCount?: number
  endCharCount?: number
  dotCount?: number
}

export const truncateString = ({
  value,
  firstCharCount = value.length,
  endCharCount = 0,
  dotCount = 3
}: TruncateProps) => {
  const shouldTruncate = value.length > firstCharCount + endCharCount
  if (!shouldTruncate) return value

  const firstPortion = value.slice(0, firstCharCount)
  const endPortion = value.slice(-endCharCount)
  const dots = '.'.repeat(dotCount)

  return `${firstPortion}${dots}${endPortion}`
}
