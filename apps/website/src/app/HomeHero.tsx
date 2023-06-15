'use client'

import { Box, Button, Heading, Input, Text } from '@palladxyz/ui'

import { Container } from '@/app/Container'

export const HomeHero = () => {
  return (
    <Container>
      <Box css={{ flexDirection: 'row', maxWidth: '40rem' }}>
        <Box css={{ paddingVertical: '8rem', gap: '1.5rem' }}>
          <Heading>The Mina wallet you're gonna love.</Heading>
          <Text>Wen? Sign up for the waitlist and we'll let you know.</Text>
          <Input placeholder="Email Address" />
          <Button variant="secondary">Join Waitlist</Button>
        </Box>
      </Box>
    </Container>
  )
}
