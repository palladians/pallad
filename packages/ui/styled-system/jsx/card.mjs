import { createElement, forwardRef } from 'react'
import { styled } from './factory.mjs';
import { getCardStyle } from '../patterns/card.mjs';

export const Card = forwardRef(function Card(props, ref) {
  const styleProps = getCardStyle()
return createElement(styled.div, { ref, ...styleProps, ...props })
})    