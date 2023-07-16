import { Button } from '@palladxyz/ui'
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
    <div className="flex-1 p-4">
      <ViewHeading title={title} />
      <div className="flex-1 justify-center items-center gap-10">
        <result.icon size={56} color={result.iconColor} />
        <div className="gap-2">
          <FormLabel>{result.label}</FormLabel>
          <div className="leading-6 overflow-hidden">{result.content}</div>
        </div>
      </div>
      <Button onClick={button.onClick}>{button.label}</Button>
    </div>
  )
}
