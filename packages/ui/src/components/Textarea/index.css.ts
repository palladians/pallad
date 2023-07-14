import { cva } from '../../../styled-system/css'
import { SystemStyleObject } from '../../../styled-system/types'
import { base as inputBase } from '../Input/index.css'

export const base: SystemStyleObject = {
  ...inputBase,
  minHeight: '5rem'
}

export const textareaStyle = cva({
  base
})
