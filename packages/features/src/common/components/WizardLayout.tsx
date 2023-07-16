import Logo from '../assets/logo.svg'

interface WizardLayoutProps {
  children: React.ReactNode
  footer: React.ReactNode
}

export const WizardLayout = ({ children, footer }: WizardLayoutProps) => {
  return (
    <div className="bg-sky-950">
      <div>
        <Logo />
      </div>
      <div className="flex justify-center">{children}</div>
      <div className="gap-8">{footer}</div>
    </div>
  )
}
