interface MetaFieldProps {
  label: string
  value: string
  url?: string
}

export const MetaField = ({ label, value, url }: MetaFieldProps) => {
  return (
    <div className="flex flex-col">
      <p className="text-sm font-semibold">{label}</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="leading-8 break-all"
      >
        {value}
      </a>
    </div>
  )
}
