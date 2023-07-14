import { cva } from '../../../styled-system/css'
import { SystemStyleObject } from '../../../styled-system/types'
import { base as inputBase } from '../Input/index.css'

const base: SystemStyleObject = {
  ...inputBase
}

export const selectStyle = cva({
  base
})
