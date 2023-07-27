/**
 * Reverses the order of bytes in a buffer.
 *
 * @param bytes - Buffer containing bytes to reverse.
 * @returns Buffer with bytes in reverse order.
 */
export function reverseBytes(bytes: Buffer) {
  const uint8 = new Uint8Array(bytes)
  return new Buffer(uint8.reverse())
}
