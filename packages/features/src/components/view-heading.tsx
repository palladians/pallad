import { ArrowLeftIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ButtonProps = {
  label: React.ReactNode
  onClick: () => void
  icon?: React.ReactNode
  testId?: string
}

type BackButtonProps = {
  onClick: () => void
}

interface ViewHeadingProps {
  title: string
  button?: ButtonProps
  backButton?: BackButtonProps
  noHorizontalPadding?: boolean
}

export const ViewHeading = ({
  title,
  button,
  backButton,
  noHorizontalPadding,
}: ViewHeadingProps) => {
  return (
    <div
      className={cn(
        "sticky top-0 right-0 left-0 bg-background flex gap-4 items-center justify-between px-4 py-2 z-10",
        noHorizontalPadding && "px-0",
      )}
    >
      {backButton && (
        <Button
          variant="secondary"
          size="icon"
          className="w-8 h-8"
          onClick={backButton.onClick}
        >
          <ArrowLeftIcon size={16} />
        </Button>
      )}
      <h2
        className="flex-1 text-lg font-semibold"
        data-testid="extension__pageTitle"
      >
        {title}
      </h2>
      {button && (
        <Button
          variant="outline"
          size="sm"
          onClick={button.onClick}
          data-testid={button.testId}
          className="gap-2"
        >
          {button.icon}
          {button.label}
        </Button>
      )}
    </div>
  )
}
