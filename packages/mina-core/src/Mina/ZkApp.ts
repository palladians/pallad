import type { BorrowedTypes } from ".."

export type SignedZkAppCommand =
  BorrowedTypes.Signed<BorrowedTypes.ZkappCommand>

export type SignableZkAppCommand = {
  command: BorrowedTypes.ZkappCommand
}
