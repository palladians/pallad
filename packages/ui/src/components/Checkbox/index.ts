import { styled, theme } from '../../lib/styled'
import { CheckBox } from 'react-native-web'

export const Checkbox = styled(CheckBox)

Checkbox.defaultProps = {
  color: theme.colors.primary600.value
}
