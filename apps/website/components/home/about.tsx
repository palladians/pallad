'use client'

import { Card } from '@palladxyz/ui'
import {
  ArrowRightLeftIcon,
  CoinsIcon,
  MousePointerClickIcon
} from 'lucide-react'
import NextImage from 'next/image'

const CARDS = [
  {
    label: 'Peer-to-Peer Payments Security',
    content: `With succinct design any user will be able to run a node on their desktop, or mobile phone making them a participant of the network unlike other wallets that rely on third parties for on-chain data.`,
    icon: ArrowRightLeftIcon
  },
  {
    label: 'Interact with zkApps',
    content: `Say goodbye to difficulty interacting with zkApps, Pallad allows seamless integration with zkApps. Our incoming Mina RPC will make your zkApp DevX easier and more enjoyable.`,
    icon: MousePointerClickIcon
  },
  {
    label: 'Staking',
    content: `Contribute to the network's security by staking with your favourite stake pool. Earn rewards by delegating your funds to block validators. Delegate to any pool you like.`,
    icon: CoinsIcon
  }
]

export const About = () => {
  return (
    <section
      className="dark:bg-indigo-900/50 bg-indigo-50 relative overflow-hidden border-t border-b py-24"
      id="about"
    >
      <NextImage
        src="/bg.jpg"
        width={1200}
        height={600}
        alt="Background"
        className="hidden lg:flex absolute inset-0 w-full h-auto mix-blend-overlay"
      />
      <div className="relative mx-auto px-4 sm:py-12 sm:px-6 lg:py-16 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Revolutionizing Payments and Finance with Cutting-edge Technology
          </h2>

          <p className="mt-4 leading-8">
            We're leveraging the power of Mina blockchain to provide a secure,
            efficient, and seamless experience. Our wallet is designed to keep
            you in control of your assets uncensorable with full-node security
            thanks to Mina's succinct design and enriched with features crafted
            to ensure the ultimate convenience.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card, i) => (
            <Card key={i} className="p-4 bg-background/50 backdrop-blur-sm">
              <card.icon />
              <h2 className="mt-4 text-xl font-bold">{card.label}</h2>
              <p className="mt-4 text-justify text-sm leading-8">
                {card.content}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
