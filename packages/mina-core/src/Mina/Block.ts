import { OpaqueNumber } from '@palladxyz/util'

/**
 * The block number.
 */
export type BlockNo = OpaqueNumber<'BlockNo'>
export const BlockNo = (value: number): BlockNo => value as unknown as BlockNo
