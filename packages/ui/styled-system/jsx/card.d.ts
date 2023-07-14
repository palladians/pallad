/* eslint-disable */
import type { FunctionComponent } from 'react'
import type { CardProperties } from '../patterns/card'
import type { HTMLStyledProps } from '../types/jsx'

export type CardProps = CardProperties & Omit<HTMLStyledProps<'div'>, keyof CardProperties >


export declare const Card: FunctionComponent<CardProps>