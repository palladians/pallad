import { useEffect, useState } from 'react'
import { Animated, Easing } from 'react-native'

export const useViewAnimation = () => {
  const [animationValue] = useState(new Animated.Value(0))
  const opacity = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.75, 1]
  })
  const shift = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 0]
  })
  const negativeShift = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-4, 0]
  })
  const scale = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.98, 1]
  })
  const animate = () => {
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
      easing: Easing.out(Easing.exp)
    }).start()
  }
  useEffect(() => {
    animate()
  }, [])
  return {
    opacity,
    shift,
    negativeShift,
    scale
  }
}
