interface MetaFieldProps {
  label: string
  value: string
}

export const MetaField = ({ label, value }: MetaFieldProps) => {
  return (
    <div className="flex flex-col">
      <p className="text-sm font-semibold">{label}</p>
      <p className="leading-8 break-all">{value}</p>
    </div>
  )
}
