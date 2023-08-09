import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge' // eslint-disable-line import/no-extraneous-dependencies

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
