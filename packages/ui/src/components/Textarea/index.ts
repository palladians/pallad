import { styled } from '../../lib/styled'
import { TextInput } from 'react-native'
import { textareaBase } from './index.css'

export const Textarea = styled(TextInput, textareaBase)

Textarea.defaultProps = {
  multiline: true,
  numberOfLines: 4
}
