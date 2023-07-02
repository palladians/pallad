import { Box, Button, composeBox, Heading, Icons, theme } from '@palladxyz/ui'
import { Pressable } from 'react-native'

type ButtonProps = {
  label: string
  onPress: () => void
}

type BackButtonProps = {
  onPress: () => void
}

interface ViewHeadingProps {
  title: string
  button?: ButtonProps
  backButton?: BackButtonProps
}

export const ViewHeading = ({
  title,
  button,
  backButton
}: ViewHeadingProps) => {
  const StyledPressable = composeBox({ baseComponent: Pressable })
  return (
    <Box
      css={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Heading
        size="md"
        css={{ color: '$gray50', marginTop: 0, paddingVertical: 4 }}
      >
        {title}
      </Heading>
      {backButton && (
        <StyledPressable
          css={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            backgroundColor: '$primary800',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={backButton.onPress}
        >
          <Icons.ArrowLeft color={theme.colors.primary500.value} size={20} />
        </StyledPressable>
      )}
      {button && (
        <Button
          variant="link"
          css={{ width: 'auto', padding: 0, color: '$gray100', height: 'auto' }}
          onPress={button.onPress}
        >
          {button.label}
        </Button>
      )}
    </Box>
  )
}
