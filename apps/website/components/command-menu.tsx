'use client'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@palladxyz/ui'
import { ArrowRightIcon, SunMoonIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import * as React from 'react'

import { siteConfig } from '@/config/site'

import { Icons } from './icons'

interface CommandMenuProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export const CommandMenu = ({ open, setOpen }: CommandMenuProps) => {
  const { setTheme, theme } = useTheme()
  const router = useRouter()
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const MENU_OPTIONS = [
    { label: 'Home', icon: ArrowRightIcon, onSelect: () => router.push('/') },
    { label: 'FAQ', icon: ArrowRightIcon, onSelect: () => router.push('/') },
    {
      label: 'Support',
      icon: ArrowRightIcon,
      onSelect: () => router.push('/')
    },
    {
      label: 'Discord',
      icon: Icons.discord,
      onSelect: () => window.open(siteConfig.links.discord, '_blank')
    },
    {
      label: 'GitHub',
      icon: Icons.gitHub,
      onSelect: () => window.open(siteConfig.links.github, '_blank')
    },
    {
      label: 'Twitter',
      icon: Icons.twitter,
      onSelect: () => window.open(siteConfig.links.twitter, '_blank')
    },
    {
      label: 'Toggle Theme',
      icon: SunMoonIcon,
      onSelect: () => setTheme(theme === 'light' ? 'dark' : 'light')
    }
  ]

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Menu">
          {MENU_OPTIONS.map((option, i) => (
            <CommandItem
              key={i}
              onSelect={() => {
                option.onSelect()
                setOpen(false)
              }}
            >
              <option.icon />
              <span className="ml-2">{option.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
