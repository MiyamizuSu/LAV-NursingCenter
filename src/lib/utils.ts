import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function encodeWithTimestampToBase64(str: string): string {
  const timestamp = Date.now()
  const combined = `${str}_${timestamp}`
  const uint8Array = new TextEncoder().encode(combined)
  const base64 = btoa(String.fromCharCode(...uint8Array))
  return base64
}