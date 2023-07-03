import { Text } from '@palladxyz/ui'

interface FormErrorProps {
  children: React.ReactNode
}

export const FormError = ({ children }: FormErrorProps) => {
  if (!children) return null
  return <Text css={{ color: '$red300', fontSize: 12 }}>{children}</Text>
}
