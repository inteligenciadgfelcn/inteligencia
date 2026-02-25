import { AsyncLocalStorage } from 'async_hooks';

export const asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();

export class RequestContext {
  static get(key: string) {
    return asyncLocalStorage.getStore()?.get(key);
  }

  static set(key: string, value: any) {
    asyncLocalStorage.getStore()?.set(key, value);
  }
}