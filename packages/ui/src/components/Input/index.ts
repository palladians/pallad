import { TextInput } from 'react-native'

import { styled } from '../../lib/styled'
import { inputBase } from './index.css'

export const Input = styled(TextInput, inputBase)

Input.defaultProps = {
  css: {
    borderColor: '$border'
  }
}
