interface MetaFieldProps {
  label: string
  value: string
}

export const MetaField = ({ label, value }: MetaFieldProps) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm">{label}</p>
      <p className="leading-6 break-all">{value}</p>
    </div>
  )
}
