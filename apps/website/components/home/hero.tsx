'use client'

import { Button } from '@palladxyz/ui'
import NextImage from 'next/image'
import NextLink from 'next/link'

export const Hero = () => {
  return (
    <section className="relative py-32">
      <NextImage
        src="/hero.jpeg"
        alt="Hero"
        width={1200}
        height={600}
        className="absolute inset-0 w-full h-full mix-blend-soft-light"
      />
      <div className="relative mx-auto max-w-screen-xl px-4 lg:flex lg:items-center">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-extrabold sm:text-5xl leading-9">
            Discover the Future of&nbsp;
            <strong className="font-extrabold sm:block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              Web3 with Pallad.
            </strong>
          </h1>
          <p className="mt-6 leading-9">
            Unlock the power of the world's lightest blockchain. Pallad brings
            top-tier engineering, user-friendly design, and open-source
            principles together in one platform. Take your first step into the
            future and experience Web3 like never before.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <NextLink href="/#waitlist">
              <Button size="lg">Join Waitlist</Button>
            </NextLink>
            <NextLink href="/#about">
              <Button variant="outline" size="lg">
                Explore More
              </Button>
            </NextLink>
          </div>
        </div>
      </div>
    </section>
  )
}
