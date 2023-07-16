import { Button } from '@palladxyz/ui'
import { ArrowLeftIcon } from 'lucide-react'

type ButtonProps = {
  label: string
  onClick: () => void
}

type BackButtonProps = {
  onClick: () => void
}

interface ViewHeadingProps {
  title: string
  button?: ButtonProps
  backButton?: BackButtonProps
}

export const ViewHeading = ({
  title,
  button,
  backButton
}: ViewHeadingProps) => {
  return (
    <div className="items-center justify-between">
      {backButton && (
        <Button onClick={backButton.onClick}>
          <ArrowLeftIcon className="text-sky-500" size={20} />
        </Button>
      )}
      <h2 className="flex-1 text-gray-50 px-1">{title}</h2>
      {button && (
        <Button variant="link" onClick={button.onClick}>
          {button.label}
        </Button>
      )}
    </div>
  )
}
