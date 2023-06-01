import { Text, View } from 'react-native'
import { styled } from '../../lib/styled'
import { boxStyles } from './index.css'

interface ComposeBoxProps {
  baseComponent?: any
}

export const composeBox = ({ baseComponent = View }: ComposeBoxProps) => styled(baseComponent, boxStyles)
export const Box = composeBox({})
