'use client'

import { Card } from '@palladxyz/ui'

const CARDS = [
  {
    title: 'Unparalleled Excellence',
    content:
      'Discover unrivaled performance and convenience with the leading Mina wallet.'
  },
  {
    title: 'Revolutionary Technology',
    content:
      'Enjoy zero-knowledge technology, a seamless transaction experience and unparalleled security.'
  },
  {
    title: 'User-Focused',
    content:
      'Join the community of users who love our intuitive and user-friendly design.'
  }
]

export const Summary = () => {
  return (
    <section className="container py-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {CARDS.map((card, i) => (
          <Card key={i} className="flex flex-col p-4 gap-2">
            <h3 className="text-lg font-semibold">{card.title}</h3>
            <p className="leading-8 text-justify">{card.content}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}
