import clsx from "clsx"
import { ArrowLeftIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { MenuBar } from "./menu-bar"

interface WizardLayoutProps {
  children: React.ReactNode
  footer?: React.ReactNode
  title?: React.ReactNode
  backButtonPath?: string | number
  headerShown?: boolean
}

export const WizardLayout = ({
  children,
  footer,
  title,
  backButtonPath,
  headerShown = true,
}: WizardLayoutProps) => {
  const navigate = useNavigate()
  return (
    <div className="flex flex-1 flex-col">
      {headerShown && (
        <MenuBar
          variant="back"
          onBackClicked={() => navigate(backButtonPath as never)}
        />
      )}
      {title && (
        <h1 className={clsx("text-3xl px-8", !headerShown && "mt-8")}>
          {title}
        </h1>
      )}
      <div className="flex flex-1 items-center px-8">{children}</div>
      {footer && (
        <div className="flex flex-col w-full justify-center items-center gap-6 p-8">
          {footer}
        </div>
      )}
    </div>
  )
}
