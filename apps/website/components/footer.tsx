'use client'

import { Button } from '@palladxyz/ui'

import { siteConfig } from '@/config/site'

import { Icons } from './icons'

export const Footer = () => {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="mx-auto mt-6 max-w-md text-center leading-relaxed">
          Pallad, proudly presented by{' '}
          <a
            href="https://palladians.xyz"
            target="_blank"
            rel="noreferrer noopener"
          >
            <Button variant="link" className="p-0">
              Palladians
            </Button>
          </a>
          .
        </p>

        <ul className="mt-12 flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-12">
          {siteConfig.mainNav.map((link, i) => (
            <Button key={i} variant="link">
              {link.title}
            </Button>
          ))}
        </ul>

        <ul className="mt-12 flex justify-center gap-6 md:gap-8">
          <li>
            <a href={siteConfig.links.twitter} rel="noreferrer" target="_blank">
              <span className="sr-only">Twitter</span>
              <Icons.twitter className="h-6 w-6 fill-current" />
            </a>
          </li>
          <li>
            <a href={siteConfig.links.github} rel="noreferrer" target="_blank">
              <span className="sr-only">GitHub</span>
              <Icons.gitHub className="h-6 w-6" />
            </a>
          </li>
          <li>
            <a href={siteConfig.links.discord} rel="noreferrer" target="_blank">
              <span className="sr-only">Discord</span>
              <Icons.discord />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
