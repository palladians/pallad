export function getRealErrorMsg(err: unknown): string | undefined {
  throw new Error(err as string)
}
