import { Box, Image } from '@palladxyz/ui'
import Logo from '@/assets/logo.svg'

interface WizardLayoutProps {
  children: React.ReactNode
  footer: React.ReactNode
}

export const WizardLayout = ({ children, footer }: WizardLayoutProps) => {
  return (
    <Box css={{ backgroundColor: '$gray900', flex: 1, padding: 16 }}>
      <Box>
        <Image source={Logo} css={{ width: 36, height: 42 }} />
      </Box>
      <Box css={{ flex: 1, justifyContent: 'center' }}>{children}</Box>
      <Box css={{ flexDirection: 'row', gap: 8 }}>{footer}</Box>
    </Box>
  )
}
