import { ArrowLeftIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { MenuBar } from "./menu-bar"

interface WizardLayoutProps {
  children: React.ReactNode
  footer?: React.ReactNode
  title?: React.ReactNode
  backButtonPath?: string | number
}

export const WizardLayout = ({
  children,
  footer,
  title,
  backButtonPath,
}: WizardLayoutProps) => {
  const navigate = useNavigate()
  return (
    <div className="flex flex-1 flex-col">
      <MenuBar
        leftSlot={
          backButtonPath && (
            <button
              type="button"
              className="btn btn-circle btn-secondary"
              onClick={() => navigate(backButtonPath as never)}
            >
              <ArrowLeftIcon size={24} />
            </button>
          )
        }
      />
      {title && <span className="text-3xl px-8">{title}</span>}
      <div className="animate-in fade-in flex flex-1 items-center px-8">
        {children}
      </div>
      {footer && (
        <div className="flex flex-col w-full justify-center items-center gap-6 p-8">
          {footer}
        </div>
      )}
    </div>
  )
}
