import { Box, Button, Text } from '@palladxyz/ui'

type ButtonProps = {
  label: string
  onPress: () => void
}

interface FormLabelProps {
  children: React.ReactNode
  button?: ButtonProps
  required?: boolean
}

export const FormLabel = ({
  children,
  button,
  required = false
}: FormLabelProps) => {
  return (
    <Box
      css={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <Text css={{ width: 'auto' }}>
        {children}
        {required && '*'}
      </Text>
      {button && (
        <Button
          variant="link"
          css={{ width: 'auto', padding: 0 }}
          onPress={button.onPress}
        >
          {button.label}
        </Button>
      )}
    </Box>
  )
}
