type ButtonProps = {
  label: string
  onClick: () => void
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
    <p>label</p>
    // <Box
    //   css={{
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     alignItems: 'center'
    //   }}
    // >
    //   <Box css={{ flexDirection: 'row', alignItems: 'center' }}>
    //     <Text
    //       css={{ width: 'auto', fontSize: 14, fontWeight: '$semibold' }}
    //       testID={testID}
    //     >
    //       {children}
    //     </Text>
    //     <Text css={{ color: '$red200' }}>{required && '*'}</Text>
    //   </Box>
    //   {button && (
    //     <Button
    //       variant="link"
    //       css={{ width: 'auto', padding: 0, height: 'auto' }}
    //       onClick={button.onClick}
    //       testID={button?.testID}
    //     >
    //       {button.label}
    //     </Button>
    //   )}
    // </Box>
  )
}
