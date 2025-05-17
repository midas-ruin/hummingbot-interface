import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * A function that merges class names using clsx and tailwind-merge
 * @param inputs - class values to be merged
 * @returns - merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
* Truncates an Ethereum address or other long string for display
* 
* @param address The full address or string to truncate
* @param prefixLength Number of characters to show at the beginning
* @param suffixLength Number of characters to show at the end
* @returns Truncated address with ellipsis in the middle
*/
export function truncateAddress(
 address: string, 
 prefixLength: number = 6, 
 suffixLength: number = 4
): string {
 if (!address) return '';
 if (address.length <= prefixLength + suffixLength) return address;
 
 return `${address.substring(0, prefixLength)}...${address.substring(address.length - suffixLength)}`;
}

/**
 * Formats a number to a currency string
 * @param value - number to format
 * @param currency - currency code (default USD)
 * @param locale - locale for formatting (default en-US)
 * @returns formatted currency string
 */
export function formatCurrency(
  value: number, 
  currency = "USD", 
  locale = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value)
}

/**
 * Formats a number with specified decimal places
 * @param value - number to format
 * @param decimals - number of decimal places
 * @returns formatted number string
 */
export function formatNumber(value: number, decimals = 2): string {
  return value.toFixed(decimals)
}

/**
 * Truncates text with ellipsis
 * @param text - text to truncate
 * @param length - maximum length
 * @returns truncated text
 */
export function truncateText(text: string, length = 25): string {
  if (text.length <= length) {
    return text
  }
  return text.slice(0, length) + "..."
}

/**
 * Truncates wallet addresses for display
 * @param address - wallet address
 * @param startLength - characters to show at start
 * @param endLength - characters to show at end
 * @returns truncated address
 */
export function truncateAddress(
  address: string, 
  startLength = 6, 
  endLength = 4
): string {
  if (!address) return ""
  if (address.length <= startLength + endLength) {
    return address
  }
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}

/**
 * Checks if code is running on client or server
 * @returns boolean indicating client environment
 */
export const isClient = typeof window !== "undefined"

/**
 * Gets local storage value with type safety
 * @param key - storage key
 * @param defaultValue - default value if not found
 * @returns stored value or default
 */
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  if (!isClient) return defaultValue
  const stored = localStorage.getItem(key)
  if (!stored) return defaultValue
  try {
    return JSON.parse(stored) as T
  } catch {
    return defaultValue
  }
}

/**
 * Safely sets local storage value
 * @param key - storage key
 * @param value - value to store
 */
export function setLocalStorage<T>(key: string, value: T): void {
  if (!isClient) return
  localStorage.setItem(key, JSON.stringify(value))
}

/**
 * Debounce function for limiting rapid function calls
 * @param fn - function to debounce
 * @param ms - debounce time in milliseconds
 * @returns debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  ms = 300
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return function(...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), ms)
  }
}
