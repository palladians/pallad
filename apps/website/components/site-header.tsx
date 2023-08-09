'use client'

import { Button, Toaster } from '@palladxyz/ui'
import { MenuIcon } from 'lucide-react'
import NextLink from 'next/link'
import Link from 'next/link'
import { useState } from 'react'

import { CommandMenu } from '@/components/command-menu'
import { Icons } from '@/components/icons'
import { MainNav } from '@/components/main-nav'
import { ThemeToggle } from '@/components/theme-toggle'
import { siteConfig } from '@/config/site'

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <>
      <CommandMenu open={menuOpen} setOpen={setMenuOpen} />
      <Toaster />
      <div className="sticky top-0 z-40 w-full">
        <div className="bg-blue-700 px-4 py-3 text-white">
          <p className="text-center text-sm font-medium">
            If you're excited about Pallad like we are,&nbsp;
            <NextLink href="/#waitlist" className="inline-block underline">
              sign up for the Closed Beta!
            </NextLink>
          </p>
        </div>
        <header className="bg-background/75 border-b backdrop-blur-lg">
          <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
            <MainNav items={siteConfig.mainNav} />
            <div className="hidden lg:flex flex-1 items-center justify-end space-x-4">
              <nav className="flex items-center space-x-1">
                <Link
                  href={siteConfig.links.twitter}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="ghost">
                    <Icons.twitter className="h-5 w-5 fill-current" />
                    <span className="sr-only">Twitter</span>
                  </Button>
                </Link>
                <Link
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="ghost">
                    <Icons.gitHub className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </Button>
                </Link>
                <Link
                  href={siteConfig.links.discord}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="ghost">
                    <Icons.discord />
                    <span className="sr-only">Discord</span>
                  </Button>
                </Link>
                <ThemeToggle />
              </nav>
            </div>
            <div className="flex lg:hidden flex-1" />
            <div className="flex lg:hidden">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setMenuOpen(true)}
              >
                <MenuIcon size={16} />
              </Button>
            </div>
          </div>
        </header>
      </div>
    </>
  )
}
