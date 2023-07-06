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
      {backButton && (
        <StyledPressable
          css={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: '$primary800',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16
          }}
          onPress={backButton.onPress}
        >
          <Icons.ArrowLeft color={theme.colors.primary400.value} size={20} />
        </StyledPressable>
      )}
      <Heading
        size="md"
        css={{ flex: 1, color: '$gray50', marginTop: 0, paddingVertical: 4 }}
      >
        {title}
      </Heading>
      {button && (
        <Button
          variant="link"
          css={{
            width: 'auto',
            paddingVertical: '$sm',
            paddingHorizontal: '$md',
            backgroundColor: '$primary800',
            height: 'auto'
          }}
          onPress={button.onPress}
        >
          {button.label}
        </Button>
      )}
    </Box>
  )
}
