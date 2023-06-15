import { Box } from '@palladxyz/ui'

interface ContainerProps {
  children: React.ReactNode
}

export const Container = ({ children }: ContainerProps) => {
  return (
    <Box
      css={{
        flex: 1,
        maxWidth: '86rem',
        marginHorizontal: 'auto',
        padding: '1rem'
      }}
    >
      {children}
    </Box>
  )
}
