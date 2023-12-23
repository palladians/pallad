import { cn } from '@/lib/utils'

interface MetaFieldProps {
  label: string
  value: string
  url?: string
  capitalize?: boolean
}

export const MetaField = ({
  label,
  value,
  url,
  capitalize = false
}: MetaFieldProps) => {
  return (
    <div className="flex flex-col">
      <p className="text-sm font-semibold">{label}</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn('leading-8 break-all', capitalize && 'capitalize')}
      >
        {value}
      </a>
    </div>
  )
}
