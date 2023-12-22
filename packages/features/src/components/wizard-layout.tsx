import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

import Logo from '@/common/assets/logo.svg'
import { Toggle } from '@/components/ui/toggle'

interface WizardLayoutProps {
  children: React.ReactNode
  footer: React.ReactNode
  textLogo?: boolean
}

export const WizardLayout = ({
  children,
  footer,
  textLogo = false
}: WizardLayoutProps) => {
  const { setTheme, theme } = useTheme()
  const toggleTheme = () => {
    theme === 'dark' ? setTheme('light') : setTheme('dark')
  }
  return (
    <div className="flex flex-1 dark:bg-slate-950 bg-white flex-col">
      <div className="flex justify-between items-center p-4">
        {textLogo ? (
          <span className="text-lg font-semibold">Pallad</span>
        ) : (
          <Logo />
        )}
        <Toggle size="sm" onClick={toggleTheme}>
          {theme === 'dark' ? <SunIcon size={16} /> : <MoonIcon size={16} />}
        </Toggle>
      </div>
      <div className="animate-in fade-in flex flex-1 items-center">
        {children}
      </div>
      <div className="flex gap-4 p-4">{footer}</div>
    </div>
  )
}
