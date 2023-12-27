import { CheckIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export type SecurityCheckProps = {
  onConfirm: () => void
}

export const SecurityCheck = ({ onConfirm }: SecurityCheckProps) => {
  return (
    <Card className="flex flex-col gap-2 p-2 rounded-[1rem]">
      <h2 className="text-lg font-semibold">Security Check</h2>
      <p>
        Confirm your screen is not being recorded and no one is currently
        looking at your screen.
      </p>
      <div className="flex flex-1 justify-end dark:bg-gray-900 bg-gray-200 rounded-[1.25rem] p-1">
        <Button
          size="sm"
          id="confirmAlone"
          variant="secondary"
          data-testid="onboarding__confirmAlone"
          className="group gap-2 pl-4"
          onClick={onConfirm}
        >
          <span>Confirm</span>
          <CheckIcon size={16} className="w-0 group-hover:w-4 transition-all" />
        </Button>
      </div>
    </Card>
  )
}
