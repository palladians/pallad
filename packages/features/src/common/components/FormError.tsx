interface FormErrorProps {
  children: React.ReactNode
}

export const FormError = ({ children }: FormErrorProps) => {
  if (!children) return null
  return (
    <div className="text-red-500 text-sm" data-testid="form__error">
      {children}
    </div>
  )
}
