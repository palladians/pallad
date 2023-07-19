import { Label } from '@palladxyz/ui'

interface MetaFieldProps {
  label: string
  value: string
}

export const MetaField = ({ label, value }: MetaFieldProps) => {
  return (
    <div className="gap-2">
      <Label>{label}</Label>
      <div className="leading-6">{value}</div>
    </div>
  )
}
