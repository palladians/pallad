import { ArrowLeftIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useNavigate } from 'react-router-dom'

import { Toggle } from '@/components/ui/toggle'

import { Button } from './ui/button'

interface WizardLayoutProps {
  children: React.ReactNode
  footer: React.ReactNode
  title: React.ReactNode
  backButtonPath?: string | number
}

export const WizardLayout = ({
  children,
  footer,
  title,
  backButtonPath
}: WizardLayoutProps) => {
  const navigate = useNavigate()
  const { setTheme, theme } = useTheme()
  const toggleTheme = () => {
    theme === 'dark' ? setTheme('light') : setTheme('dark')
  }
  return (
    <div className="flex flex-1 bg-background flex-col">
      <div className="flex justify-between items-center p-4">
        <div className="flex gap-4 items-center">
          {backButtonPath && (
            <Button
              variant="secondary"
              size="icon"
              className="w-8 h-8"
              onClick={() => navigate(backButtonPath as never)}
            >
              <ArrowLeftIcon size={16} />
            </Button>
          )}
          <span className="text-lg font-semibold">{title}</span>
        </div>
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
