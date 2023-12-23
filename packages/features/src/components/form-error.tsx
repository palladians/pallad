interface FormErrorProps {
  children: React.ReactNode
}

export const FormError = ({ children }: FormErrorProps) => {
  if (!children) return null
  return (
    <div className="text-destructive text-sm" data-testid="form__error">
      {children}
    </div>
  )
}
