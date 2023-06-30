import { Box, Button, Text } from '@palladxyz/ui'
import { ElementType } from 'react'

import { FormLabel } from '../../common/components/FormLabel'
import { ViewHeading } from '../../common/components/ViewHeading'

type TxResult = {
  icon: ElementType
  iconColor: string
  label: string
  content: string
}

type TxButton = {
  label: string
  onPress: () => void
}

interface TransactionResultProps {
  title: string
  result: TxResult
  button: TxButton
}

export const TransactionResult = ({
  title,
  result,
  button
}: TransactionResultProps) => {
  return (
    <Box css={{ flex: 1, padding: '$md' }}>
      <ViewHeading title={title} />
      <Box
        css={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 40
        }}
      >
        <result.icon size={56} color={result.iconColor} />
        <Box css={{ gap: 8 }}>
          <FormLabel>{result.label}</FormLabel>
          <Text
            numberOfLines={2}
            css={{ lineHeight: '175%', overflow: 'hidden', width: '100%' }}
          >
            {result.content}
          </Text>
        </Box>
      </Box>
      <Button onPress={button.onPress}>{button.label}</Button>
    </Box>
  )
}
