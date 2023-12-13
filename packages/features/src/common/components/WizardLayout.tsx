import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Toggle } from '@/components/ui/toggle'

import Logo from '../assets/logo.svg'

interface WizardLayoutProps {
  children: React.ReactNode
  footer: React.ReactNode
}

export const WizardLayout = ({ children, footer }: WizardLayoutProps) => {
  const { setTheme, theme } = useTheme()
  const toggleTheme = () => {
    theme === 'dark' ? setTheme('light') : setTheme('dark')
  }
  return (
    <div className="flex flex-1 dark:bg-slate-950 bg-white flex-col p-4">
      <div className="flex justify-between">
        <Logo />
        <Toggle size="sm" onClick={toggleTheme}>
          {theme === 'dark' ? <SunIcon size={16} /> : <MoonIcon size={16} />}
        </Toggle>
      </div>
      <div className="flex flex-1 items-center">{children}</div>
      <div className="flex gap-4">{footer}</div>
    </div>
  )
}
