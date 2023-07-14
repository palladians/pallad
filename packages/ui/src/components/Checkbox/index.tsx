import { Indicator, Root } from '@radix-ui/react-checkbox'
import { CheckIcon } from 'lucide-react'
import React from 'react'

import { styled } from '../../../styled-system/jsx'
import { checkboxIndicatorStyle, checkboxRootStyle } from './index.css'

const CheckboxRoot = styled(Root, checkboxRootStyle)
const CheckboxIndicator = styled(Indicator, checkboxIndicatorStyle)

export const Checkbox = () => {
  return (
    <CheckboxRoot>
      <CheckboxIndicator>
        <CheckIcon size={16} />
      </CheckboxIndicator>
    </CheckboxRoot>
  )
}
