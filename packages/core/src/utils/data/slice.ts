import type { ByteArray, Hex } from '../../types'
import { isHex } from './isHex'
import { size } from './size'

type SliceResult<TValue extends ByteArray | Hex> = TValue extends Hex
  ? Hex
  : ByteArray

/**
 * @description Returns a section of the hex or byte array given a start/end bytes offset.
 *
 * @param value The hex or byte array to slice.
 * @param start The start offset (in bytes).
 * @param end The end offset (in bytes).
 */
export function slice<TValue extends ByteArray | Hex>(
  value: TValue,
  start?: number,
  end?: number,
): SliceResult<TValue> {
  if (isHex(value))
    return sliceHex(value as Hex, start, end) as SliceResult<TValue>
  return sliceBytes(value as ByteArray, start, end) as SliceResult<TValue>
}

function assertStartOffset(value: Hex | ByteArray, start?: number) {
  if (typeof start === 'number' && start > 0 && start > size(value) - 1)
    throw new Error(
      `Slice starting at offset "${start}" is out-of-bounds (size: ${size(
        value,
      )}).`,
    )
}

/**
 * @description Returns a section of the byte array given a start/end bytes offset.
 *
 * @param value The byte array to slice.
 * @param start The start offset (in bytes).
 * @param end The end offset (in bytes).
 */
export function sliceBytes(value: ByteArray, start?: number, end?: number) {
  assertStartOffset(value, start)
  return value.slice(start, end)
}

/**
 * @description Returns a section of the hex value given a start/end bytes offset.
 *
 * @param value The hex value to slice.
 * @param start The start offset (in bytes).
 * @param end The end offset (in bytes).
 */
export function sliceHex(value_: Hex, start?: number, end?: number) {
  assertStartOffset(value_, start)
  const value = value_
    .replace('0x', '')
    .slice((start ?? 0) * 2, (end ?? value_.length) * 2)
  return `0x${value}`
}