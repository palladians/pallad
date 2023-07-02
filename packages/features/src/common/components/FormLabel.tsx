import { Box, Button, Text } from '@palladxyz/ui'

type ButtonProps = {
  label: string
  onPress: () => void
  testID?: string
}

interface FormLabelProps {
  children: React.ReactNode
  testID?: string
  button?: ButtonProps
  required?: boolean
}

export const FormLabel = ({
  children,
  testID,
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
      <Box css={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text
          css={{ width: 'auto', fontSize: 14, fontWeight: '$semibold' }}
          testID={testID}
        >
          {children}
        </Text>
        <Text css={{ color: '$red200' }}>{required && '*'}</Text>
      </Box>
      {button && (
        <Button
          variant="link"
          css={{ width: 'auto', padding: 0, height: 'auto' }}
          onPress={button.onPress}
          testID={button?.testID}
        >
          {button.label}
        </Button>
      )}
    </Box>
  )
}
