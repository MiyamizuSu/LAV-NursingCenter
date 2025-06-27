import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function debounce<T extends (...args: any[]) => void>(fn: T, delay = 1500): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
export function encodeWithTimestampToBase64(str: string): string {
  const timestamp = Date.now()
  const combined = `${str}_${timestamp}`
  const uint8Array = new TextEncoder().encode(combined)
  const base64 = btoa(String.fromCharCode(...uint8Array))
  return base64
}
