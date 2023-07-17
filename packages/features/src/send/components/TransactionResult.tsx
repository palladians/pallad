import { Button, Label } from '@palladxyz/ui'
import { ElementType } from 'react'

import { FormLabel } from '../../common/components/FormLabel'
import { ViewHeading } from '../../common/components/ViewHeading'

type TxResult = {
  icon: ElementType
  iconColor: string
  label: string
  content: string
}

type TxButton = {
  label: string
  onClick: () => void
}

interface TransactionResultProps {
  title: string
  result: TxResult
  button: TxButton
}

export const TransactionResult = ({
  title,
  result,
  button
}: TransactionResultProps) => {
  return (
    <div className="flex flex-col flex-1">
      <ViewHeading title={title} />
      <div className="flex flex-1 justify-center items-center gap-4">
        <result.icon size={56} color={result.iconColor} />
        <div className="gap-2">
          <Label>{result.label}</Label>
          <div className="leading-6 overflow-hidden break-all">
            {result.content}
          </div>
        </div>
      </div>
      <Button onClick={button.onClick}>{button.label}</Button>
    </div>
  )
}
