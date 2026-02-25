import { AsyncLocalStorage } from 'async_hooks'

export const asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>()

export function getCurrentUser() {
  return asyncLocalStorage.getStore()?.get('user')
}