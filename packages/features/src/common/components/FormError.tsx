interface FormErrorProps {
  children: React.ReactNode
}

export const FormError = ({ children }: FormErrorProps) => {
  if (!children) return null
  return <div className="text-red-300 text-md">{children}</div>
}
