import { CheckBox } from 'react-native-web'

import { styled, theme } from '../../lib/styled'

export const Checkbox = styled(CheckBox)

Checkbox.defaultProps = {
  color: theme.colors.primary600.value
}
