import { Box } from './components/Box'
import { theme } from './lib/styled'
import { Text } from './components/Text'
import { StoryDefault } from '@ladle/react/lib/app/exports'

export const Colors = () => {
  const iterableColors = Object.entries(theme.colors)
  return (
    <Box css={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
      {iterableColors.map(([name, color]) => (
        <Box
          key={name}
          css={{
            gap: 8,
            width: 180,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Box
            css={{
              width: 128,
              height: 128,
              backgroundColor: color.value,
              borderRadius: '$md',
              boxShadow: '0 4px 1rem rgba(0, 0, 0, 0.1)'
            }}
          />
          <Text css={{ color: '$gray400', textAlign: 'center' }}>{name}</Text>
        </Box>
      ))}
    </Box>
  )
}

export default {
  title: 'Pallad UI'
} satisfies StoryDefault
