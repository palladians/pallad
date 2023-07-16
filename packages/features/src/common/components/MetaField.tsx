import { FormLabel } from './FormLabel'

interface MetaFieldProps {
  label: string
  value: string
}

export const MetaField = ({ label, value }: MetaFieldProps) => {
  return (
    <div className="gap-2">
      <FormLabel>{label}</FormLabel>
      <div className="leading-6">{value}</div>
    </div>
  )
}
