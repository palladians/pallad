/* eslint-disable */
import type { SystemStyleObject, ConditionalValue } from '../types'
import type { PropertyValue } from '../types/prop-type'
import type { Properties } from '../types/csstype'
import type { Tokens } from '../tokens'

export type CardProperties = {
   
}


type CardOptions = CardProperties & Omit<SystemStyleObject, keyof CardProperties >


export declare function card(options?: CardOptions): string
